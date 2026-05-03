import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import postsRouter from './posts.js';
import categoriesRouter from './categories.js';
import uploadRouter from './upload.js';
import analyticsRouter from './analytics.js';
import usersRouter from './users.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/auth', authRouter);
  router.use('/posts', postsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/upload', uploadRouter);
  router.use('/analytics', analyticsRouter);
  router.use('/users', usersRouter);

  return router;
};
