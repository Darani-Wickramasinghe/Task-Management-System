import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { taskService, userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/ErrorAlert/ErrorAlert';
import styles from './TaskFormPage.module.css';

const PRIORITY_MAP_TO_DB = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high'
};

const PRIORITY_MAP_FROM_DB = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High'
};

const STATUS_MAP_TO_DB = {
  'To Do': 'todo',
  'In Progress': 'in_progress',
  'Completed': 'completed'
};

const STATUS_MAP_FROM_DB = {
  'todo': 'To Do',
  'in_progress': 'In Progress',
  'completed': 'Completed'
};

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCollaborator } = useAuth();
  const isEditing = !!id;

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
    assigneeId: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing && isCollaborator) {
      navigate('/tasks');
      return;
    }

    async function loadData() {
      try {
        const usersRes = await userService.getAll();
        setUsers(usersRes.data || []);

        if (isEditing) {
          const taskRes = await taskService.getById(id);
          const task = taskRes.data;
          setForm({
            title: task.title || '',
            description: task.description || '',
            priority: PRIORITY_MAP_FROM_DB[task.priority] || 'Medium',
            status: STATUS_MAP_FROM_DB[task.status] || 'To Do',
            dueDate: task.due_date ? task.due_date.substring(0, 10) : '',
            assigneeId: task.assignments?.[0]?.user_id || '',
          });
        }
      } catch (err) {
        setApiError(err.response?.data?.message || err.message || 'Failed to load data');
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    if (!form.assigneeId) errs.assigneeId = 'Assignee is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      if (isEditing) {
        if (isCollaborator) {
          await taskService.updateStatus(id, STATUS_MAP_TO_DB[form.status]);
        } else {
          const payload = {
            title: form.title,
            description: form.description,
            priority: PRIORITY_MAP_TO_DB[form.priority],
            status: STATUS_MAP_TO_DB[form.status],
            due_date: form.dueDate ? new Date(form.dueDate).toISOString() : null,
            assignee_ids: form.assigneeId ? [form.assigneeId] : []
          };
          await taskService.update(id, payload);
          await taskService.updateStatus(id, STATUS_MAP_TO_DB[form.status]);
          if (form.assigneeId) {
            await api.post(`/tasks/${id}/assign`, { user_ids: [form.assigneeId] });
          }
        }
      } else {
        const payload = {
          title: form.title,
          description: form.description,
          priority: PRIORITY_MAP_TO_DB[form.priority],
          status: STATUS_MAP_TO_DB[form.status],
          due_date: form.dueDate ? new Date(form.dueDate).toISOString() : null,
          assignee_ids: form.assigneeId ? [form.assigneeId] : []
        };
        await taskService.create(payload);
      }
      navigate('/tasks');
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{isEditing ? 'Edit Task' : 'Create Task'}</h1>
        <p>{isEditing ? 'Update the task details below' : 'Fill in the details to create a new task'}</p>
      </div>

      {apiError && <ErrorAlert message={apiError} onClose={() => setApiError('')} />}

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="task-title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={isCollaborator}
            />
            {errors.title && <span className={styles.fieldError}>{errors.title}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              className={styles.textarea}
              placeholder="Enter task description..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isCollaborator}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className={styles.select}
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                disabled={isCollaborator}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className={styles.select}
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-due-date">
                Due Date <span className={styles.required}>*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                className={`${styles.input} ${errors.dueDate ? styles.error : ''}`}
                value={form.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                disabled={isCollaborator}
              />
              {errors.dueDate && <span className={styles.fieldError}>{errors.dueDate}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="task-assignee">
                Assignee <span className={styles.required}>*</span>
              </label>
              <select
                id="task-assignee"
                className={`${styles.select} ${errors.assigneeId ? styles.error : ''}`}
                value={form.assigneeId}
                onChange={(e) => handleChange('assigneeId', e.target.value)}
                disabled={isCollaborator}
              >
                <option value="">Select assignee...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              {errors.assigneeId && <span className={styles.fieldError}>{errors.assigneeId}</span>}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
