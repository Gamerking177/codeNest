import { Router } from 'express';
import { ProgramController } from '../controllers/program.controller.js';
import { ShareController } from '../controllers/share.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProgramSchema,
  updateProgramSchema,
  queryProgramsSchema,
} from '../schemas/program.schema.js';
import { createShareSchema } from '../schemas/share.schema.js';

const router = Router();

// All program endpoints require valid user authentication
router.use(requireAuth);

// Program analytics & metadata
router.get('/stats', requirePermission('program:read'), ProgramController.getStats);
router.get('/subjects', requirePermission('program:read'), ProgramController.getSubjects);
router.get('/tags', requirePermission('program:read'), ProgramController.getTags);

// CRUD
router.post('/', requirePermission('program:create'), validate(createProgramSchema), ProgramController.create);
router.get('/', requirePermission('program:read'), validate(queryProgramsSchema, 'query'), ProgramController.getAll);

router.get('/:id', requirePermission('program:read'), ProgramController.getById);
router.patch('/:id', requirePermission('program:update'), validate(updateProgramSchema), ProgramController.update);
router.delete('/:id', requirePermission('program:delete'), ProgramController.delete);
router.patch('/:id/favorite', requirePermission('program:favorite'), ProgramController.toggleFavorite);

// Program Sharing (Owner only)
router.post(
  '/:id/shares',
  requirePermission('program:share'),
  validate(createShareSchema),
  ShareController.createShare
);
router.get('/:id/shares', requirePermission('program:share'), ShareController.getShares);
router.delete('/:id/shares/:shareId', requirePermission('program:share'), ShareController.revokeShare);

export default router;
