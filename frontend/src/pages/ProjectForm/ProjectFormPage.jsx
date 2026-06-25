import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService, userService } from '../../services/api';
import styles from './ProjectFormPage.module.css';

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({ name: '', description: '', manager_id: '' });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersRes = await userService.getAll();
        const eligibleManagers = (usersRes.data || []).filter(
          (u) => u.role === 'admin' || u.role === 'project_manager'
        );
        setManagers(eligibleManagers);

        if (isEdit) {
          const res = await projectService.getById(id);
          setFormData({
            name: res.data.name,
            description: res.data.description || '',
            manager_id: res.data.manager_id || '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
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
            <label htmlFor="manager_id">Assign Manager <span className={styles.required}>*</span></label>
            <select
              id="manager_id"
              value={formData.manager_id}
              onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
              required
              className={styles.select}
            >
              <option value="">Select a Manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
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
