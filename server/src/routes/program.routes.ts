import { Router } from 'express';
import { ProgramController } from '../controllers/program.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProgramSchema,
  updateProgramSchema,
  queryProgramsSchema,
} from '../schemas/program.schema.js';

const router = Router();

// All program endpoints require valid user authentication
router.use(requireAuth);

router.get('/stats', ProgramController.getStats);
router.get('/subjects', ProgramController.getSubjects);
router.get('/tags', ProgramController.getTags);

router.post('/', validate(createProgramSchema), ProgramController.create);
router.get('/', validate(queryProgramsSchema, 'query'), ProgramController.getAll);

router.get('/:id', ProgramController.getById);
router.patch('/:id', validate(updateProgramSchema), ProgramController.update);
router.delete('/:id', ProgramController.delete);
router.patch('/:id/favorite', ProgramController.toggleFavorite);

export default router;
