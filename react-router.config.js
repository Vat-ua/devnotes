import { getPrerenderRoutes } from './scripts/content-routes.mjs';
import { prepareGitHubPagesArtifact } from './scripts/prepare-github-pages.mjs';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const basename = process.env.DEVNOTES_BASE_PATH ?? env.VITE_BASE_PATH ?? '/devnotes/';
const prerender = getPrerenderRoutes();

export default {
  basename,
  buildDirectory: 'build',
  routeDiscovery: { mode: 'initial' },
  ssr: false,
  prerender,
  async buildEnd() {
    await prepareGitHubPagesArtifact({
      basename,
      clientDirectory: 'build/client',
      routes: prerender,
    });
  },
};
