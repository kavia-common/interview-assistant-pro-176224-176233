import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Reports from './pages/Reports';
import { getToken } from './api/client';
import { useTheme } from './theme';

// PUBLIC_INTERFACE
export function ProtectedRoute() {
  /** Route wrapper that redirects to /login if unauthenticated. */
  const token = getToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

function NavLink({ to, children }) {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to);
  return (
    <Link className={`nav-link ${active ? 'active' : ''}`} to={to}>
      {children}
    </Link>
  );
}

// PUBLIC_INTERFACE
export default function Router() {
  /** App Router configuration with minimal sidebar shell. */
  const { theme } = useTheme();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthShell><Login /></AuthShell>} />
        <Route path="/register" element={<AuthShell><Register /></AuthShell>} />
        <Route element={<ProtectedAppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">{children}</div>
    </div>
  );
}

function ProtectedAppShell() {
  const { theme } = useTheme();
  return (
    <div className="app-layout">
      <aside className="sidebar" style={{ background: theme.surface, borderRight: `1px solid ${theme.border}` }}>
        <div className="sidebar-title">Menu</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">🏠 Dashboard</NavLink>
          <NavLink to="/interview">🎤 Interview</NavLink>
          <NavLink to="/reports">📊 Reports</NavLink>
        </nav>
      </aside>
      <section className="content">
        <ProtectedRoute />
      </section>
    </div>
  );
}
