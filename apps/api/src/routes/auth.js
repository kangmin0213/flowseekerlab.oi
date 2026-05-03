import express from 'express';
import bcrypt from 'bcryptjs';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const authData = await pb.collection('users').authWithPassword(email, password);

  const user = authData.record;

  logger.info(`User ${email} logged in successfully`);

  res.json({
    token: authData.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// POST /auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  pb.authStore.clear();
  logger.info(`User ${req.userId} logged out`);
  res.json({ success: true });
});

// POST /auth/register (admin only)
router.post('/register', requireAuth, requireRole('admin'), async (req, res) => {
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

  logger.info(`New user ${email} registered with role ${role}`);

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

export default router;
