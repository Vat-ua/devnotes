import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { articles, labs } from '@content/registry';
import { getPageMeta } from '../content/siteMeta.js';

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname, articles, labs);
    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:type', meta.type);
    setMeta('property', 'og:url', meta.canonical);
    setMeta('property', 'og:image', meta.image);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', meta.image);
    setMeta('property', 'article:published_time', meta.publishedTime);
    setMeta('property', 'article:section', meta.section);
    setCanonical(meta.canonical);
  }, [pathname]);

  return null;
}

function setMeta(attribute, name, content) {
  const selector = `meta[${attribute}="${name}"]`;
  const element = document.head.querySelector(selector);

  if (!content) {
    element?.remove();
    return;
  }

  const meta = element ?? document.createElement('meta');
  meta.setAttribute(attribute, name);
  meta.content = content;
  if (!element) document.head.append(meta);
}

function setCanonical(href) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = href;
}
