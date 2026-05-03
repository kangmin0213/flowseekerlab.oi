import express from 'express';
import sharp from 'sharp';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// POST /upload - file upload (auth required)
router.post('/', requireAuth, express.raw({ type: 'application/octet-stream', limit: '10MB' }), async (req, res) => {
  const contentType = req.headers['content-type'];
  const filename = req.headers['x-filename'];

  if (!filename) {
    return res.status(400).json({ error: 'x-filename header is required' });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` });
  }

  if (req.body.length > MAX_FILE_SIZE) {
    return res.status(400).json({ error: `File size exceeds 5MB limit` });
  }

  let compressedBuffer = req.body;

  try {
    compressedBuffer = await sharp(req.body)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (err) {
    logger.error('Image compression failed:', err.message);
    throw new Error('Failed to process image');
  }

  const newFilename = `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}.webp`;

  const image = await pb.collection('images').create(
    {
      filename: newFilename,
      size: compressedBuffer.length,
      uploader_id: req.userId,
    },
    { 'file': new File([compressedBuffer], newFilename, { type: 'image/webp' }) }
  );

  const imageUrl = `${pb.baseUrl}/api/files/${image.collectionId}/${image.id}/${image.file}`;

  logger.info(`File ${newFilename} uploaded by user ${req.userId}`);

  res.status(201).json({
    filename: image.filename,
    url: imageUrl,
    size: image.size,
    id: image.id,
  });
});

export default router;
