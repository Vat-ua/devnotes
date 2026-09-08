/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
import LabsPage from '../../src/pages/labs/index.jsx';
import { pageMeta } from '../meta.js';

export function meta() {
  return pageMeta('/labs');
}

export default function Labs() {
  return <LabsPage />;
}
