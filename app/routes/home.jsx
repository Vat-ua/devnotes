/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
import HomePage from '../../src/pages/home/index.jsx';
import { pageMeta } from '../meta.js';

export function meta() {
  return pageMeta('/');
}

export default function Home() {
  return <HomePage />;
}
