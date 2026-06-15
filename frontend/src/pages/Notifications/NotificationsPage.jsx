import { useNotifications } from '../../context/NotificationContext';
import styles from './NotificationsPage.module.css';

const TYPE_INFO = {
  assigned: { icon: '📌', label: 'Task Assigned', className: 'assigned' },
  status: { icon: '🔄', label: 'Status Changed', className: 'status' },
  comment: { icon: '💬', label: 'New Comment', className: 'comment' },
  deadline: { icon: '⏰', label: 'Deadline Reminder', className: 'deadline' },
  administrative: { icon: '⚙️', label: 'Admin Update', className: 'administrative' },
};

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Notifications</h1>
          <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={markAllRead} id="mark-all-read">
            ✓ Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className={styles.list}>
          {notifications.map((notif) => {
            const info = TYPE_INFO[notif.type] || TYPE_INFO.assigned;
            return (
              <div
                key={notif.id}
                className={`${styles.item} ${!notif.is_read ? styles.unread : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`${styles.itemIcon} ${styles[info.className]}`}>
                  {info.icon}
                </div>
                <div className={styles.itemContent}>
                  <div
                    className={styles.itemText}
                    dangerouslySetInnerHTML={{ __html: notif.message }}
                  />
                  <div className={styles.itemMeta}>
                    <span className={styles.itemTime}>{formatTimeAgo(notif.created_at)}</span>
                    <span className={styles.typeBadge}>{info.label}</span>
                  </div>
                </div>
                {!notif.is_read && <div className={styles.unreadDot} />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div style={{ fontSize: '48px' }}>🔔</div>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
