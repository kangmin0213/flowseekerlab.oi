import pb from '@/lib/pocketbaseClient.js';

let cache = { row: undefined, at: 0 };
const TTL_MS = 60_000;

export const CMS_DEFAULTS = {
  site_name: 'FlowSeeker Lab',
  site_tagline: 'Read the flow with AI & Crypto, and turn it into action.',
  site_description:
    'High-signal analysis at the intersection of AI and crypto. Insights, alpha, and build-in-public project logs.',
  site_url: 'https://flowseekerlab.io',
  twitter_handle: '@flowseekerlab',
  posts_per_page: 20,
  comments_enabled: true,
  footer_nav: [],
  footer_social: [],
};

const isHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s.trim());
const isInternalPath = (s) => typeof s === 'string' && s.trim().startsWith('/');

const sanitizeLinkList = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it) => {
      if (!it || typeof it !== 'object') return null;
      const label = typeof it.label === 'string' ? it.label.trim() : '';
      const url = typeof it.url === 'string' ? it.url.trim() : '';
      if (!label || !url) return null;
      if (!isHttpUrl(url) && !isInternalPath(url)) return null;
      return { label, url };
    })
    .filter(Boolean);
};

export async function getCmsSettingsRow() {
  if (cache.row !== undefined && Date.now() - cache.at < TTL_MS) {
    return cache.row;
  }
  try {
    const res = await pb.collection('cms_settings').getList(1, 1, { $autoCancel: false });
    const row = res.items[0] || null;
    cache = { row, at: Date.now() };
    return row;
  } catch {
    cache = { row: null, at: Date.now() };
    return null;
  }
}

export function invalidateCmsSettingsCache() {
  cache = { row: undefined, at: 0 };
}

const pickString = (row, key) => {
  const v = row?.[key];
  return typeof v === 'string' && v.trim() ? v : CMS_DEFAULTS[key];
};

const parseMaybeJson = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/** Public site meta merged with safe defaults; stable shape for UI. */
export async function getSiteMeta() {
  const row = await getCmsSettingsRow();
  return {
    site_name: pickString(row, 'site_name'),
    site_tagline: pickString(row, 'site_tagline'),
    site_description: pickString(row, 'site_description'),
    site_url: pickString(row, 'site_url'),
    twitter_handle: pickString(row, 'twitter_handle'),
    footer_nav: sanitizeLinkList(parseMaybeJson(row?.footer_nav)),
    footer_social: sanitizeLinkList(parseMaybeJson(row?.footer_social)),
  };
}

/** Blog/search list page size (1–100), default 20. */
export async function getPostsPerPage() {
  const row = await getCmsSettingsRow();
  const n = row?.posts_per_page;
  if (typeof n === 'number' && Number.isFinite(n)) {
    return Math.min(100, Math.max(1, Math.floor(n)));
  }
  return CMS_DEFAULTS.posts_per_page;
}

/** Whether public comment forms should be shown (best-effort). */
export async function getCommentsEnabled() {
  const row = await getCmsSettingsRow();
  if (row && typeof row.comments_enabled === 'boolean') return row.comments_enabled;
  return CMS_DEFAULTS.comments_enabled;
}
