/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
import NotFoundPage from '../../src/pages/not-found/index.jsx';
import { pageMeta } from '../meta.js';

export function meta() {
  return pageMeta('/404');
}

export default function NotFound() {
  return <NotFoundPage />;
}
