import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Router from './router';
import { ThemeContext, defaultTheme } from './theme';
import { getToken, logout } from './api/client';

// PUBLIC_INTERFACE
function App() {
  /** Root app with theme provider and router shell. */
  const [themeMode, setThemeMode] = useState('light');
  const theme = useMemo(() => ({ ...defaultTheme, mode: themeMode }), [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));

  // If token becomes invalid on any page action, user can click logout in the topbar
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, toggleTheme }}>
      <div className="app-shell" style={{ background: theme.background, minHeight: '100vh', color: theme.text }}>
        <header className="topbar" style={{
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-dot" />
              <span>Interview Assistant</span>
            </div>
            <div className="topbar-actions">
              <button className="btn-secondary" onClick={toggleTheme} aria-label="Toggle theme">
                {themeMode === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
              {getToken() ? (
                <button className="btn" onClick={handleLogout}>Logout</button>
              ) : null}
            </div>
          </div>
        </header>
        <main className="main-container">
          <Router />
        </main>
        <footer className="footer" style={{ borderTop: `1px solid ${theme.border}`, background: theme.surface }}>
          <div className="footer-inner">© {new Date().getFullYear()} Interview Assistant</div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
