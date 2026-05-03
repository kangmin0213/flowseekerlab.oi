export const SITE = {
  name: 'FlowSeeker Lab',
  tagline: 'Read the flow with AI & Crypto, and turn it into action.',
  description:
    'FlowSeeker Lab — high-signal analysis at the intersection of AI and crypto. Insights, market alpha, and build-in-public project logs.',
  url: 'https://flowseekerlab.io',
  twitter: '@flowseekerlab',
  defaultImage: '/og-default.png',
  locale: 'en_US',
  author: 'FlowSeeker Lab',
};

export const buildPageTitle = (title) =>
  title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;

export const canonicalUrl = (path = '/') => {
  const base = SITE.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
};
