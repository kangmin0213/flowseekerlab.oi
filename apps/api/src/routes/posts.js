import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /posts - with filters, pagination, and sorting
router.get('/', async (req, res) => {
  const { category, author, status, dateFrom, dateTo, page = 1, limit = 10, sortBy = 'created', sortOrder = 'desc' } = req.query;

  let filter = '';
  const filters = [];

  if (category) filters.push(`category_id = "${category}"`);
  if (author) filters.push(`author_id = "${author}"`);
  if (status) filters.push(`status = "${status}"`);
  if (dateFrom) filters.push(`created >= "${dateFrom}"`);
  if (dateTo) filters.push(`created <= "${dateTo}"`);

  filter = filters.join(' && ');

  const validSortFields = ['title', 'created', 'views', 'author_id'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created';
  const sortDirection = sortOrder === 'asc' ? '+' : '-';
  const sort = `${sortDirection}${sortField}`;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 10));

  const posts = await pb.collection('posts').getList(pageNum, pageSize, {
    filter: filter || undefined,
    sort,
    expand: 'author_id,category_id',
  });

  logger.info(`Retrieved ${posts.items.length} posts (page ${pageNum})`);

  res.json({
    items: posts.items.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      status: post.status,
      views: post.views || 0,
      featured_image: post.featured_image,
      published_at: post.published_at,
      scheduled_at: post.scheduled_at,
      created: post.created,
      updated: post.updated,
      author: post.expand?.author_id ? {
        id: post.expand.author_id.id,
        name: post.expand.author_id.name,
        email: post.expand.author_id.email,
      } : null,
      category: post.expand?.category_id ? {
        id: post.expand.category_id.id,
        name: post.expand.category_id.name,
      } : null,
    })),
    total: posts.total,
    page: pageNum,
    limit: pageSize,
    totalPages: Math.ceil(posts.total / pageSize),
  });
});

// GET /posts/:id - single post with details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const post = await pb.collection('posts').getOne(id, {
    expand: 'author_id,category_id',
  });

  res.json({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    slug: post.slug,
    status: post.status,
    views: post.views || 0,
    featured_image: post.featured_image,
    published_at: post.published_at,
    scheduled_at: post.scheduled_at,
    created: post.created,
    updated: post.updated,
    author: post.expand?.author_id ? {
      id: post.expand.author_id.id,
      name: post.expand.author_id.name,
      email: post.expand.author_id.email,
    } : null,
    category: post.expand?.category_id ? {
      id: post.expand.category_id.id,
      name: post.expand.category_id.name,
      description: post.expand.category_id.description,
    } : null,
  });
});

// POST /posts - create post (auth required)
router.post('/', requireAuth, async (req, res) => {
  const { title, content, excerpt, slug, category_id, featured_image, status = 'draft', published_at, scheduled_at } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const validStatuses = ['draft', 'published', 'scheduled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const post = await pb.collection('posts').create({
    title,
    content,
    excerpt: excerpt || '',
    slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
    category_id: category_id || null,
    featured_image: featured_image || null,
    status,
    published_at: published_at || null,
    scheduled_at: scheduled_at || null,
    author_id: req.userId,
    views: 0,
  });

  logger.info(`Post "${title}" created by user ${req.userId}`);

  res.status(201).json({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    slug: post.slug,
    status: post.status,
    featured_image: post.featured_image,
    published_at: post.published_at,
    scheduled_at: post.scheduled_at,
    created: post.created,
  });
});

// PUT /posts/:id - update post (auth required, author or admin)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, slug, category_id, featured_image, status, published_at, scheduled_at } = req.body;

  const post = await pb.collection('posts').getOne(id);

  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    logger.warn(`User ${req.userId} attempted to update post ${id} without permission`);
    return res.status(403).json({ error: 'You can only edit your own posts' });
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (slug !== undefined) updateData.slug = slug;
  if (category_id !== undefined) updateData.category_id = category_id;
  if (featured_image !== undefined) updateData.featured_image = featured_image;
  if (status !== undefined) updateData.status = status;
  if (published_at !== undefined) updateData.published_at = published_at;
  if (scheduled_at !== undefined) updateData.scheduled_at = scheduled_at;

  const updatedPost = await pb.collection('posts').update(id, updateData);

  logger.info(`Post ${id} updated by user ${req.userId}`);

  res.json({
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    excerpt: updatedPost.excerpt,
    slug: updatedPost.slug,
    status: updatedPost.status,
    featured_image: updatedPost.featured_image,
    published_at: updatedPost.published_at,
    scheduled_at: updatedPost.scheduled_at,
    updated: updatedPost.updated,
  });
});

// DELETE /posts/:id - delete post (auth required, author or admin)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const post = await pb.collection('posts').getOne(id);

  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    logger.warn(`User ${req.userId} attempted to delete post ${id} without permission`);
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }

  await pb.collection('posts').delete(id);

  logger.info(`Post ${id} deleted by user ${req.userId}`);

  res.json({ success: true });
});

// POST /posts/:id/publish - publish post (auth required, author or admin)
router.post('/:id/publish', requireAuth, async (req, res) => {
  const { id } = req.params;

  const post = await pb.collection('posts').getOne(id);

  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    logger.warn(`User ${req.userId} attempted to publish post ${id} without permission`);
    return res.status(403).json({ error: 'You can only publish your own posts' });
  }

  const now = new Date().toISOString();
  const updatedPost = await pb.collection('posts').update(id, {
    status: 'published',
    published_at: now,
  });

  logger.info(`Post ${id} published by user ${req.userId}`);

  res.json({
    id: updatedPost.id,
    status: updatedPost.status,
    published_at: updatedPost.published_at,
  });
});

// POST /posts/:id/schedule - schedule post (auth required, author or admin)
router.post('/:id/schedule', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { scheduled_at } = req.body;

  if (!scheduled_at) {
    return res.status(400).json({ error: 'scheduled_at is required' });
  }

  const post = await pb.collection('posts').getOne(id);

  if (post.author_id !== req.userId && req.userRole !== 'admin') {
    logger.warn(`User ${req.userId} attempted to schedule post ${id} without permission`);
    return res.status(403).json({ error: 'You can only schedule your own posts' });
  }

  const updatedPost = await pb.collection('posts').update(id, {
    status: 'scheduled',
    scheduled_at,
  });

  logger.info(`Post ${id} scheduled by user ${req.userId} for ${scheduled_at}`);

  res.json({
    id: updatedPost.id,
    status: updatedPost.status,
    scheduled_at: updatedPost.scheduled_at,
  });
});

export default router;
