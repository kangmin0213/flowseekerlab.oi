import pb from '@/lib/pocketbaseClient.js';

export const calcReadTime = (html) => {
  if (!html) return 1;
  const text = String(html).replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export const formatDate = (iso, locale = 'en-US') => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

export const featuredImageUrl = (post, fallback = null) => {
  if (!post?.featured_image) return fallback;
  try {
    return pb.files.getUrl(post, post.featured_image, { thumb: '800x500' });
  } catch {
    return fallback;
  }
};

export const stripHtml = (html, len = 200) => {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > len ? text.slice(0, len).trim() + '…' : text;
};
