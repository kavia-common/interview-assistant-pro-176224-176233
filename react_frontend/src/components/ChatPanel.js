import React from 'react';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function ChatPanel({ messages = [] }) {
  /** Renders conversational messages as bubbles. */
  const { theme } = useTheme();

  return (
    <div className="chat-panel" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      <div className="chat-inner">
        {messages.length === 0 ? (
          <div className="muted">No messages yet. Start the session to receive your first question.</div>
        ) : messages.map((m, idx) => (
          <div key={idx} className={`bubble ${m.role}`}>
            <div className="bubble-content">
              {m.text}
            </div>
            {m.meta ? <div className="bubble-meta">{m.meta}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
