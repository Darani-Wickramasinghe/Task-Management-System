import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../../services/api';
import styles from './ProjectFormPage.module.css';

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchProject = async () => {
        try {
          const res = await projectService.getById(id);
          setFormData({
            name: res.data.name,
            description: res.data.description || '',
          });
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch project');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await projectService.update(id, formData);
      } else {
        await projectService.create(formData);
      }
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className={styles.loading}>Loading project data...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>{isEdit ? 'Edit Project' : 'Create Project'}</h1>
          <p>{isEdit ? 'Update project details' : 'Start a new project'}</p>
        </div>
      </div>

      <div className={styles.formCard}>
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Project Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Q3 Marketing Campaign"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project's goals and scope..."
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/projects')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
