import { Router } from 'express';
import authRoutes from './auth.routes.js';
import programRoutes from './program.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'codenest-api',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);

export default router;
