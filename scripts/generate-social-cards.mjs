import { Resvg } from '@resvg/resvg-js';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getContentVisualPair } from '../src/utils/contentVisuals.js';

const projectDir = fileURLToPath(new URL('../', import.meta.url));
const outputDir = join(projectDir, 'public', 'social');
const fontPath = join(projectDir, 'scripts', 'assets', 'fonts', 'SpaceGrotesk.ttf');
const css = await readFile(join(projectDir, 'src', 'styles', 'index.css'), 'utf8');
const content = await Promise.all([loadContent('articles'), loadContent('labs')]);

await rm(outputDir, { recursive: true, force: true });

for (const entry of content.flat()) {
  const [primaryToken, secondaryToken] = getContentVisualPair(entry.slug);
  const svg = createSocialCard({
    ...entry,
    primaryColor: resolveCssColor(primaryToken),
    secondaryColor: resolveCssColor(secondaryToken),
  });
  const renderer = new Resvg(svg, {
    fitTo: { mode: 'original' },
    font: {
      fontFiles: [fontPath],
      loadSystemFonts: false,
      defaultFontFamily: 'Space Grotesk',
    },
  });
  const destination = join(outputDir, entry.kind, `${entry.slug}.png`);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, renderer.render().asPng());
}

console.log(`Social cards gerados: ${content.flat().length}.`);

async function loadContent(kind) {
  const contentDir = join(projectDir, 'content', kind);
  const entries = await readdir(contentDir, { withFileTypes: true });

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .sort((first, second) => first.name.localeCompare(second.name, 'pt-BR'))
      .map(async (entry) => {
        const metaPath = join(contentDir, entry.name, 'meta.js');
        const { meta } = await import(pathToFileURL(metaPath));
        return {
          kind,
          slug: entry.name,
          title: meta.title,
          label: kind === 'articles' ? meta.category : meta.topics.join(' · '),
        };
      }),
  );
}

function createSocialCard({ kind, title, label, primaryColor, secondaryColor }) {
  const { fontSize, lines } = getTitleLayout(title);
  const lineHeight = Math.round(fontSize * 1.02);
  const titleLines = lines
    .map(
      (line, index) => `<tspan x="88" y="${220 + index * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#151614"/>
      <circle cx="1120" cy="70" r="238" fill="${primaryColor}"/>
      <circle cx="1080" cy="625" r="190" fill="${secondaryColor}"/>
      <circle cx="936" cy="338" r="26" fill="#bdff3f"/>
      <text x="88" y="91" fill="#f6f5ef" font-family="Space Grotesk" font-size="25" font-weight="700" letter-spacing="2">DevNotes</text>
      <text x="88" y="137" fill="#b0aea5" font-family="Space Grotesk" font-size="21" font-weight="500" letter-spacing="1.4">${kind === 'articles' ? 'ARTIGO' : 'LAB'}</text>
      <text fill="#f6f5ef" font-family="Space Grotesk" font-size="${fontSize}" font-weight="700" letter-spacing="-2.2">${titleLines}</text>
      <text x="88" y="556" fill="#f6f5ef" font-family="Space Grotesk" font-size="22" font-weight="500">${escapeXml(label)}</text>
      <text x="88" y="594" fill="#8d8c85" font-family="Space Grotesk" font-size="18" font-weight="400" letter-spacing="0.4">vat-ua.github.io/devnotes</text>
    </svg>
  `;
}

function getTitleLayout(title) {
  for (const fontSize of [86, 78, 70, 62, 54, 48]) {
    const lines = wrapText(title, 760 / fontSize);
    if (lines.length <= 3) return { fontSize, lines };
  }

  throw new Error(`Título longo demais para o social card: "${title}".`);
}

function wrapText(text, maxWidth) {
  const lines = [];
  let currentLine = '';

  for (const word of text.split(/\s+/)) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && measureText(candidate) > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function measureText(text) {
  return [...text].reduce((width, character) => {
    if (character === ' ') return width + 0.28;
    if (/[ilI1.,:;!|]/.test(character)) return width + 0.28;
    if (/[mwMW@%]/.test(character)) return width + 0.82;
    if (character === character.toUpperCase() && character !== character.toLowerCase()) {
      return width + 0.66;
    }
    return width + 0.52;
  }, 0);
}

function resolveCssColor(token) {
  const variables = new Map(
    [...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  );
  const visited = new Set();
  let value = variables.get(token);

  while (value?.startsWith('var(--')) {
    if (visited.has(value)) throw new Error(`Referência CSS circular em --${token}.`);
    visited.add(value);
    const referencedToken = value.match(/^var\(--([\w-]+)\)$/)?.[1];
    value = referencedToken ? variables.get(referencedToken) : undefined;
  }

  if (!value) throw new Error(`Não foi possível resolver a cor CSS --${token}.`);
  return value;
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character],
  );
}
