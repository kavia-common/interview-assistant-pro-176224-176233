import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Simple dashboard with quick links and summaries. */
  const { theme } = useTheme();
  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="muted">Practice interviews and track your progress.</p>
      </div>
      <div className="grid">
        <div className="card" style={{ background: theme.surface }}>
          <div className="card-header">
            <h3>Start Practice</h3>
          </div>
          <div className="card-body">
            <p>Choose an interview mode and begin your session.</p>
            <div className="actions">
              <Link className="btn" to="/interview?mode=hr">Start HR</Link>
              <Link className="btn-secondary" to="/interview?mode=technical">Start Technical</Link>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: theme.surface }}>
          <div className="card-header">
            <h3>Recent Performance</h3>
          </div>
          <div className="card-body">
            <p className="muted">Your latest scores will appear here after you complete interviews.</p>
            <ul className="list">
              <li>Last HR Session: —</li>
              <li>Last Technical Session: —</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
