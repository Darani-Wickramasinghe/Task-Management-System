import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import styles from './Navbar.module.css';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onToggleSidebar}>
          ☰
        </button>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks, projects..."
            id="global-search"
          />
        </div>
      </div>

      <div className={styles.right}>
        {/* Theme toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          id="theme-toggle"
        >
          <span className={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className={styles.notifBtn}
            onClick={() => setShowNotifications((prev) => !prev)}
            id="notification-bell"
          >
            🔔
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          {showNotifications && (
            <NotificationDropdown
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* User */}
        <div className={styles.userSection}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.userName}>{user?.name || 'User'}</div>
            <div className={styles.userRole}>{user?.role || 'Role'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
