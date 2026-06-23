import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteProject, setDeleteProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAll();
      setProjects(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (deleteProject) {
      try {
        await projectService.delete(deleteProject.id);
        setProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
        setDeleteProject(null);
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete project');
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Projects</h1>
          <p>{projects.length} projects found</p>
        </div>
        <div className={styles.controls}>
          <button className={styles.createBtn} onClick={() => navigate('/projects/create')}>
            ➕ New Project
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.emptyState}>Loading projects...</div>
        ) : error ? (
          <div className={styles.emptyState} style={{ color: 'red' }}>{error}</div>
        ) : projects.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Tasks Count</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td style={{ fontWeight: 600 }}>{project.name}</td>
                  <td>{project.description || 'No description'}</td>
                  <td>{project.creator?.name || 'Unknown'}</td>
                  <td>{project._count?.tasks || 0}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={() => setDeleteProject(project)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '48px' }}>📭</div>
            <p>No projects found.</p>
          </div>
        )}
      </div>

      {deleteProject && (
        <ConfirmationModal
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteProject.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteProject(null)}
        />
      )}
    </div>
  );
}
