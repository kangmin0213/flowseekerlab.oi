import logger from '../utils/logger.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  req.token = token;
  req.userId = req.headers['x-user-id'];
  req.userRole = req.headers['x-user-role'];

  if (!req.userId || !req.userRole) {
    return res.status(401).json({ error: 'Missing user context' });
  }

  next();
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      logger.warn(`Access denied for user ${req.userId} with role ${req.userRole}`);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
