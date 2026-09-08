import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), '');
const port = Number(process.env.DEVNOTES_PREVIEW_PORT ?? 4178);
const basename = (process.env.DEVNOTES_BASE_PATH ?? env.VITE_BASE_PATH ?? '/devnotes/').replace(
  /\/$/,
  '',
);
const clientDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../build/client',
);
const previewUrl = `http://127.0.0.1:${port}${basename}/`;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
};

try {
  await stat(path.join(clientDirectory, 'index.html'));
} catch {
  console.error('Build de produção não encontrado. Execute: pnpm build');
  process.exit(1);
}

console.log(`Iniciando preview em ${previewUrl}`);

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname !== basename && !pathname.startsWith(`${basename}/`)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const relativePath = decodeURIComponent(pathname.slice(basename.length)).replace(/^\/+/, '');
  const requestedPath = path.resolve(clientDirectory, relativePath || 'index.html');
  const filePath = await resolveFile(requestedPath);

  if (filePath && isWithinClientDirectory(filePath)) {
    sendFile(filePath, response, 200);
    return;
  }

  sendFile(path.join(clientDirectory, '404.html'), response, 404);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`A porta ${port} já está em uso. Encerre o processo anterior e tente novamente.`);
  } else {
    console.error('Não foi possível iniciar o preview:', error);
  }
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview pronto: ${previewUrl}`);
  console.log('Mantenha este terminal aberto. Use Ctrl+C para encerrar.');
});

async function resolveFile(requestedPath) {
  try {
    const stats = await stat(requestedPath);
    if (stats.isFile()) return requestedPath;
    if (stats.isDirectory()) return path.join(requestedPath, 'index.html');
  } catch {
    return undefined;
  }

  return undefined;
}

function sendFile(filePath, response, status) {
  response.writeHead(status, {
    'Content-Type': contentTypes[path.extname(filePath)] ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}

function isWithinClientDirectory(filePath) {
  const relativePath = path.relative(clientDirectory, filePath);
  return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}
