import express from 'express';
import bcrypt from 'bcryptjs';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /users - all users (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await pb.collection('users').getFullList({
    sort: '-created',
  });

  logger.info(`Retrieved ${users.length} users`);

  res.json(
    users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created: user.created,
      updated: user.updated,
    }))
  );
});

// POST /users - create user (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Email, password, name, and role are required' });
  }

  const validRoles = ['admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await pb.collection('users').create({
    email,
    password: hashedPassword,
    passwordConfirm: hashedPassword,
    name,
    role,
  });

  logger.info(`User ${email} created by admin ${req.userId}`);

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// PUT /users/:id - update user (admin only)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { email, name, role, password } = req.body;

  const updateData = {};
  if (email !== undefined) updateData.email = email;
  if (name !== undefined) updateData.name = name;
  if (role !== undefined) updateData.role = role;
  if (password !== undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
    updateData.passwordConfirm = hashedPassword;
  }

  const user = await pb.collection('users').update(id, updateData);

  logger.info(`User ${id} updated by admin ${req.userId}`);

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// DELETE /users/:id - delete user (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;

  if (id === req.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }

  await pb.collection('users').delete(id);

  logger.info(`User ${id} deleted by admin ${req.userId}`);

  res.json({ success: true });
});

export default router;
