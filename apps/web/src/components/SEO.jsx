import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE, buildPageTitle, canonicalUrl } from '@/lib/seo.js';

function SEO({
  title,
  description = SITE.description,
  path = '/',
  image = SITE.defaultImage,
  type = 'website',
  publishedAt,
  updatedAt,
  author = SITE.author,
  noindex = false,
  jsonLd,
}) {
  const finalTitle = buildPageTitle(title);
  const url = canonicalUrl(path);
  const fullImage = image?.startsWith('http') ? image : `${SITE.url.replace(/\/$/, '')}${image}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content={SITE.locale} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      {author && type === 'article' && <meta property="article:author" content={author} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export default SEO;
