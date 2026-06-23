import { prisma } from '../config/prisma.js';

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'admin') {
      projects = await prisma.project.findMany({
        include: { creator: true, _count: { select: { tasks: true } } },
        orderBy: { created_at: 'desc' },
      });
    } else if (req.user.role === 'project_manager') {
      projects = await prisma.project.findMany({
        where: { created_by: req.user.userId },
        include: { creator: true, _count: { select: { tasks: true } } },
        orderBy: { created_at: 'desc' },
      });
    } else {
      // Collaborator sees projects they are assigned to via tasks
      const tasks = await prisma.task.findMany({
        where: { assignments: { some: { user_id: req.user.userId } }, project_id: { not: null } },
        select: { project_id: true }
      });
      const projectIds = [...new Set(tasks.map(t => t.project_id))];
      
      projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        include: { creator: true, _count: { select: { tasks: true } } },
        orderBy: { created_at: 'desc' },
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { creator: true, tasks: { include: { assignments: { include: { user: true } } } } },
    });

    if (!project) {
      return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Project not found' });
    }

    // Role-based access control
    if (req.user.role === 'project_manager' && project.created_by !== req.user.userId) {
      return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'You do not have access to this project' });
    }

    if (req.user.role === 'collaborator') {
      const isAssigned = project.tasks.some(task => 
        task.assignments.some(a => a.user_id === req.user.userId)
      );
      if (!isAssigned) {
        return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'You do not have access to this project' });
      }
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ errorCode: 'VALIDATION_ERROR', message: 'Name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        created_by: req.user.userId,
      },
      include: { creator: true },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existingProject) {
      return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Project not found' });
    }

    if (req.user.role === 'project_manager' && existingProject.created_by !== req.user.userId) {
      return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'You do not have permission to edit this project' });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description },
      include: { creator: true },
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const existingProject = await prisma.project.findUnique({ 
      where: { id: req.params.id },
      include: { _count: { select: { tasks: true } } }
    });

    if (!existingProject) {
      return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Project not found' });
    }

    if (req.user.role === 'project_manager' && existingProject.created_by !== req.user.userId) {
      return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'You do not have permission to delete this project' });
    }

    if (existingProject._count.tasks > 0) {
      return res.status(400).json({ 
        errorCode: 'VALIDATION_ERROR', 
        message: 'Cannot delete project because it has tasks. Please delete or reassign the tasks first.' 
      });
    }

    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};
