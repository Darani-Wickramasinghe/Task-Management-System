import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

// View projects (accessible to all authenticated users)
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Manage projects (restricted to admin and project manager roles)
router.post('/', authorize('admin', 'project_manager'), createProject);
router.put('/:id', authorize('admin', 'project_manager'), updateProject);
router.delete('/:id', authorize('admin', 'project_manager'), deleteProject);

export default router;
