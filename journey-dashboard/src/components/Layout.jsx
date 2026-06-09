import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Calendar, 
  LogOut, 
  Moon, 
  Sun,
  Target
} from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <Target size={24} />
            <span>Journey</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/analytics" className="nav-link">
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
            <Link to="/history" className="nav-link">
              <Calendar size={18} />
              <span>History</span>
            </Link>
            <Link to="/settings" className="nav-link">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="header-actions">
            <button className="icon-btn-lg" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {user && (
              <button className="icon-btn-lg" onClick={handleSignOut} title="Sign out">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>Attention so controlled, execution becomes inevitable.</p>
        </div>
      </footer>
    </div>
  );
}
