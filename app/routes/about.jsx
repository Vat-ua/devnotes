/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
import AboutPage from '../../src/pages/about/index.jsx';
import { pageMeta } from '../meta.js';

export function meta() {
  return pageMeta('/sobre');
}

export default function About() {
  return <AboutPage />;
}
