import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /categories - all categories with post count
router.get('/', async (req, res) => {
  const categories = await pb.collection('categories').getFullList({
    sort: '+name',
  });

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const postCount = await pb.collection('posts').getList(1, 1, {
        filter: `category_id = "${cat.id}"`,
      });
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        slug: cat.slug,
        parent_id: cat.parent_id,
        postCount: postCount.total,
      };
    })
  );

  logger.info(`Retrieved ${categoriesWithCount.length} categories`);

  res.json(categoriesWithCount);
});

// POST /categories - create category (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, description, slug, parent_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const category = await pb.collection('categories').create({
    name,
    description: description || '',
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    parent_id: parent_id || null,
  });

  logger.info(`Category "${name}" created by admin ${req.userId}`);

  res.status(201).json({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    parent_id: category.parent_id,
  });
});

// PUT /categories/:id - update category (admin only)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, description, slug, parent_id } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (slug !== undefined) updateData.slug = slug;
  if (parent_id !== undefined) updateData.parent_id = parent_id;

  const category = await pb.collection('categories').update(id, updateData);

  logger.info(`Category ${id} updated by admin ${req.userId}`);

  res.json({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    parent_id: category.parent_id,
  });
});

// DELETE /categories/:id - delete category (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;

  await pb.collection('categories').delete(id);

  logger.info(`Category ${id} deleted by admin ${req.userId}`);

  res.json({ success: true });
});

export default router;
