import { index, route } from '@react-router/dev/routes';

export default [
  index('./routes/home.jsx'),
  route('articles', './routes/articles.jsx'),
  route('articles/:slug', './routes/article.jsx'),
  route('labs', './routes/labs.jsx'),
  route('labs/:slug', './routes/lab.jsx'),
  route('sobre', './routes/about.jsx'),
  route('*', './routes/not-found.jsx'),
];
