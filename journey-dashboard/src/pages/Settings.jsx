import { useState } from 'react';
import { Settings as SettingsIcon, User, Download, Upload, Save, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

export default function Settings() {
  const { profile, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await updateProfile({ full_name: fullName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  const handleImport = () => {
    alert('Import functionality coming soon!');
  };

  return (
    <div className="container settings-page">
      <div className="page-header">
        <SettingsIcon size={28} />
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
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
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setSaved(false);
                }}
                placeholder="Your full name"
              />
            </div>
            <div className="setting-item">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={profile?.email || ''}
                readOnly
                title="Email cannot be changed here"
              />
              <p className="setting-hint">Email cannot be changed</p>
            </div>
            {saveError && <p className="setting-error">{saveError}</p>}
            <button
              className={`btn btn-primary ${saved ? 'btn-saved' : ''}`}
              onClick={handleSaveProfile}
              disabled={isSaving || !fullName.trim() || fullName.trim() === (profile?.full_name || '')}
            >
              {isSaving ? (
                <>Saving…</>
              ) : saved ? (
                <><Check size={15} /> Saved</>
              ) : (
                <><Save size={15} /> Save Profile</>
              )}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-section card">
          <h2 className="settings-section-title">
            <SettingsIcon size={18} />
            Preferences
          </h2>
          <div className="settings-content">
            <div className="setting-item">
              <label className="label">Theme</label>
              <div className="theme-toggle-row">
                <span className="theme-badge">
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </span>
                <button className="btn btn-sm" onClick={toggleTheme}>
                  Switch to {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
              <p className="setting-hint">You can also toggle from the header button</p>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
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
