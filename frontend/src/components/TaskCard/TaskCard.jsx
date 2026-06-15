import styles from './TaskCard.module.css';

export default function TaskCard({ task, provided }) {
  const initials = task.assignee
    ? task.assignee
        .split(' ')
        .map((n) => n[0])
        .join('')
    : '?';

  return (
    <div
      className={styles.card}
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
    >
      <div className={styles.header}>
        <span className={styles.title}>{task.title}</span>
        <span className={`${styles.priorityBadge} ${styles[task.priority?.toLowerCase()]}`}>
          {task.priority}
        </span>
      </div>

      <div className={styles.meta}>
        <span className={styles.dueDate}>
          📅 {task.dueDate}
        </span>
        <div className={styles.assignee}>
          <div className={styles.assigneeAvatar}>{initials}</div>
          <span className={styles.assigneeName}>{task.assignee}</span>
        </div>
      </div>
    </div>
  );
}
