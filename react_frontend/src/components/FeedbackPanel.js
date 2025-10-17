import React from 'react';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function FeedbackPanel({ feedback, score }) {
  /** Displays feedback block and score summary. */
  const { theme } = useTheme();
  if (!feedback && (score === undefined || score === null)) return null;

  return (
    <div className="card" style={{ background: theme.surface }}>
      <div className="card-header">
        <h3>Feedback</h3>
      </div>
      <div className="card-body">
        {feedback ? <p>{feedback}</p> : null}
        {typeof score === 'number' ? (
          <div className="score">
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
            </div>
            <div className="score-label">Score: {Math.round(score)} / 100</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
