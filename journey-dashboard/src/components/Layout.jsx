import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  Target,
  Menu,
  X
} from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/analytics', label: 'Analytics', Icon: BarChart3 },
    { to: '/history', label: 'History', Icon: Calendar },
    { to: '/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <NavLink to="/" className="logo" onClick={closeMobileMenu}>
            <Target size={24} />
            <span>Journey</span>
          </NavLink>
          
          {/* Desktop nav */}
          <nav className="nav">
            {navLinks.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button className="icon-btn-lg" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <button className="icon-btn-lg" onClick={handleSignOut} title="Sign out">
                <LogOut size={18} />
              </button>
            )}
            {/* Mobile hamburger */}
            <button
              className="icon-btn-lg mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            {navLinks.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
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
