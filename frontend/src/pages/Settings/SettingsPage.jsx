import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      return;
    }
    setPasswordSuccess(true);
    setPasswords({ current: '', newPassword: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>👤 Profile Information</h2>
        {profileSuccess && (
          <div className={styles.successMsg}>✅ Profile updated successfully!</div>
        )}
        <form className={styles.form} onSubmit={handleProfileSave}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-name">Full Name</label>
              <input
                id="settings-name"
                type="text"
                className={styles.input}
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                className={styles.input}
                value={profile.email}
                disabled
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Role</label>
            <input
              type="text"
              className={styles.input}
              value={user?.role || ''}
              disabled
            />
          </div>
          <button type="submit" className={styles.saveBtn}>
            Update Profile
          </button>
        </form>
      </div>

      {/* Appearance Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🎨 Appearance</h2>
        <div className={styles.themeRow}>
          <div className={styles.themeInfo}>
            <span className={styles.themeLabel}>Dark Mode</span>
            <span className={styles.themeDesc}>
              {isDark ? 'Dark theme is active' : 'Switch to dark theme for reduced eye strain'}
            </span>
          </div>
          <label className={styles.toggleSwitch} id="dark-mode-toggle">
            <input type="checkbox" checked={isDark} onChange={toggleTheme} />
            <span className={styles.slider} />
          </label>
        </div>
        <div className={styles.themePreview}>
          <div
            className={`${styles.previewBox} ${styles.light} ${!isDark ? styles.active : ''}`}
            onClick={() => isDark && toggleTheme()}
          >
            ☀️ Light
          </div>
          <div
            className={`${styles.previewBox} ${styles.dark} ${isDark ? styles.active : ''}`}
            onClick={() => !isDark && toggleTheme()}
          >
            🌙 Dark
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔒 Change Password</h2>
        {passwordSuccess && (
          <div className={styles.successMsg}>✅ Password changed successfully!</div>
        )}
        <form className={styles.form} onSubmit={handlePasswordSave}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="current-password">Current Password</label>
            <input
              id="current-password"
              type="password"
              className={styles.input}
              placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className={styles.input}
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className={styles.input}
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className={styles.saveBtn}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
