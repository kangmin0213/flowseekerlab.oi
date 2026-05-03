import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /analytics - overview stats (admin/viewer only)
router.get('/', requireAuth, requireRole('admin', 'viewer'), async (req, res) => {
  const totalPostsResult = await pb.collection('posts').getList(1, 1);
  const totalPosts = totalPostsResult.total;

  const publishedPostsResult = await pb.collection('posts').getList(1, 1, {
    filter: 'status = "published"',
  });
  const publishedPosts = publishedPostsResult.total;

  const allPosts = await pb.collection('posts').getFullList({
    filter: 'status = "published"',
  });
  const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const avgViews = allPosts.length > 0 ? Math.round(totalViews / allPosts.length) : 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const newPostsThisMonth = await pb.collection('posts').getList(1, 1, {
    filter: `created >= "${monthStart}" && status = "published"`,
  });

  const newUsersThisMonth = await pb.collection('users').getList(1, 1, {
    filter: `created >= "${monthStart}"`,
  });

  const commentsResult = await pb.collection('comments').getList(1, 1);
  const totalComments = commentsResult.total;

  logger.info(`Analytics overview retrieved by user ${req.userId}`);

  res.json({
    totalPosts,
    publishedPosts,
    totalViews,
    avgViews,
    totalComments,
    newPostsThisMonth: newPostsThisMonth.total,
    newUsersThisMonth: newUsersThisMonth.total,
  });
});

// GET /analytics/posts/:id - post-specific analytics (admin/viewer only)
router.get('/posts/:id', requireAuth, requireRole('admin', 'viewer'), async (req, res) => {
  const { id } = req.params;

  const post = await pb.collection('posts').getOne(id);

  const views = post.views || 0;
  const uniqueVisitors = post.unique_visitors || 0;

  logger.info(`Post ${id} analytics retrieved by user ${req.userId}`);

  res.json({
    postId: post.id,
    title: post.title,
    views,
    uniqueVisitors,
    published_at: post.published_at,
    created: post.created,
  });
});

export default router;
