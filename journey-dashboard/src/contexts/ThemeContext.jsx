import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { profile, updateProfile } = useAuth();

  // ✅ Initialize from localStorage immediately so there's no flash of wrong theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme attribute to document on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // Sync theme when profile loads (e.g., after login)
  useEffect(() => {
    if (profile?.theme_preference) {
      const profileTheme = profile.theme_preference;
      // Only sync if profile theme differs from current local theme
      if (profileTheme !== theme) {
        setTheme(profileTheme);
        document.documentElement.setAttribute('data-theme', profileTheme);
        localStorage.setItem('theme', profileTheme);
      }
    }
    // Intentionally only dep on profile to avoid loop with `theme`
  }, [profile?.theme_preference]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Apply immediately — don't wait for DB
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Best-effort DB save — failure doesn't affect local toggle
    if (profile) {
      try {
        await updateProfile({ theme_preference: newTheme });
      } catch (error) {
        console.error('Could not save theme preference to profile:', error);
        // Theme is already applied locally — no revert needed
      }
    }
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
