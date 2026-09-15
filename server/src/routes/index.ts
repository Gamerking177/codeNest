import { Router } from 'express';
import authRoutes from './auth.routes.js';
import programRoutes from './program.routes.js';
import healthRoutes from './health.routes.js';
import { ShareController } from '../controllers/share.controller.js';

const router = Router();

// Health routes (/api/v1/health, /api/v1/health/live, /api/v1/health/ready)
router.use('/health', healthRoutes);

// Auth & User routes
router.use('/auth', authRoutes);

// Program CRUD & Sharing routes
router.use('/programs', programRoutes);

// Public read-only shared program endpoint
router.get('/shared/:token', ShareController.getShared);

export default router;
