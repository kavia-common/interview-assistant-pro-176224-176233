import React from 'react';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function ReportCard({ report, onOpen }) {
  /** Displays a single report summary item. */
  const { theme } = useTheme();
  const date = report?.date || report?.createdAt || report?._id || 'Session';
  const score = typeof report?.score === 'number' ? report.score : null;
  const mode = report?.mode || '—';
  return (
    <div className="card report-card" style={{ background: theme.surface }}>
      <div className="card-body">
        <div className="report-top">
          <div>
            <div className="report-title">{date}</div>
            <div className="muted">Mode: {mode}</div>
          </div>
          {score !== null ? <div className="report-score">{Math.round(score)}/100</div> : <div className="muted">No score</div>}
        </div>
        <div className="actions">
          <button className="btn-secondary" onClick={() => onOpen?.(report)}>View</button>
        </div>
      </div>
    </div>
  );
}
