import { Settings as SettingsIcon, User, Download, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

export default function Settings() {
  const { profile } = useAuth();
  const { theme } = useTheme();

  const handleExport = () => {
    // Export functionality
    alert('Export functionality coming soon!');
  };

  const handleImport = () => {
    // Import functionality
    alert('Import functionality coming soon!');
  };

  return (
    <div className="container settings-page">
      <div className="page-header">
        <SettingsIcon size={28} />
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="settings-section card">
          <h2 className="settings-section-title">
            <User size={18} />
            Profile
          </h2>
          <div className="settings-content">
            <div className="setting-item">
              <label className="label">Full Name</label>
              <input 
                type="text" 
                className="input" 
                value={profile?.full_name || ''} 
                readOnly
              />
            </div>
            <div className="setting-item">
              <label className="label">Email</label>
              <input 
                type="email" 
                className="input" 
                value={profile?.email || ''} 
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="settings-section card">
          <h2 className="settings-section-title">
            <SettingsIcon size={18} />
            Preferences
          </h2>
          <div className="settings-content">
            <div className="setting-item">
              <label className="label">Theme</label>
              <div className="theme-badge">
                {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </div>
              <p className="setting-hint">Use the theme toggle in the header to change</p>
            </div>
          </div>
        </div>

        <div className="settings-section card">
          <h2 className="settings-section-title">
            <Download size={18} />
            Data Management
          </h2>
          <div className="settings-content">
            <div className="setting-item">
              <button className="btn" onClick={handleExport}>
                <Download size={16} />
                Export Data
              </button>
              <p className="setting-hint">Download all your data as JSON</p>
            </div>
            <div className="setting-item">
              <button className="btn" onClick={handleImport}>
                <Upload size={16} />
                Import Data
              </button>
              <p className="setting-hint">Restore data from a backup file</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
