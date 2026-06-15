import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import styles from './NotificationDropdown.module.css';

const TYPE_ICONS = {
  assigned: { icon: '📌', className: 'assigned' },
  status: { icon: '🔄', className: 'status' },
  comment: { icon: '💬', className: 'comment' },
  deadline: { icon: '⏰', className: 'deadline' },
  administrative: { icon: '⚙️', className: 'administrative' },
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

export default function NotificationDropdown({ onClose }) {
  const { notifications, markRead, markAllRead } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dropdown}>
        <div className={styles.header}>
          <h3 className={styles.title}>Notifications</h3>
          <button className={styles.markAllBtn} onClick={markAllRead}>
            Mark all read
          </button>
        </div>

        <div className={styles.list}>
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notif) => {
              const typeInfo = TYPE_ICONS[notif.type] || TYPE_ICONS.assigned;
              return (
                <div
                  key={notif.id}
                  className={`${styles.item} ${!notif.is_read ? styles.unread : ''}`}
                  onClick={() => markRead(notif.id)}
                >
                  <div className={`${styles.itemIcon} ${styles[typeInfo.className]}`}>
                    {typeInfo.icon}
                  </div>
                  <div className={styles.itemContent}>
                    <div
                      className={styles.itemText}
                      dangerouslySetInnerHTML={{ __html: notif.message }}
                    />
                    <div className={styles.itemTime}>{formatTimeAgo(notif.created_at)}</div>
                  </div>
                  {!notif.is_read && <div className={styles.unreadDot} />}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              No notifications yet
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Link to="/notifications" className={styles.viewAllLink} onClick={onClose}>
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
}
