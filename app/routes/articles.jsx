/* oxlint-disable react/only-export-components -- Framework route modules co-locate route exports. */
import ArticlesPage from '../../src/pages/articles/index.jsx';
import { pageMeta } from '../meta.js';

export function meta() {
  return pageMeta('/articles');
}

export default function Articles() {
  return <ArticlesPage />;
}
