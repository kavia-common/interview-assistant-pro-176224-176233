import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import FeedbackPanel from '../components/FeedbackPanel';
import VoiceControls from '../components/VoiceControls';
import { api } from '../api/client';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function Interview() {
  /** Interview flow page with question, answer input, feedback, and voice. */
  const { theme } = useTheme();
  const [params] = useSearchParams();
  const mode = params.get('mode') || 'hr';

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = questionId && answer.trim().length > 0 && !busy;

  useEffect(() => {
    // Start session and fetch initial question
    (async () => {
      setBusy(true);
      setError('');
      try {
        const s = await api.startInterview({ mode });
        const sid = s?.sessionId || s?.id || s?._id || s?.session || null;
        setSessionId(sid || null);
        let qobj = s?.firstQuestion;
        if (!qobj) {
          qobj = await api.nextQuestion(mode);
        }
        if (qobj) {
          setQuestion(qobj.question || qobj.text || '');
          setQuestionId(qobj.id || qobj.questionId || qobj._id || null);
          setMessages([
            { role: 'assistant', text: qobj.question || qobj.text || 'Welcome! Please answer the first question.' },
          ]);
        }
      } catch (e) {
        setError(e?.message || 'Failed to start interview');
      } finally {
        setBusy(false);
      }
    })();
  }, [mode]);

  const onTranscript = (txt) => {
    setAnswer(prev => (prev ? `${prev} ${txt}` : txt));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError('');
    setFeedback('');
    try {
      const userMsg = { role: 'user', text: answer };
      setMessages(prev => [...prev, userMsg]);

      const resp = await api.submitAnswer({ sessionId, questionId, answer });
      const fb = resp?.feedback || resp?.message || '';
      const sc = typeof resp?.score === 'number' ? resp.score : null;
      setFeedback(fb);
      if (sc !== null) setScore(sc);

      let nextQ = resp?.nextQuestion;
      if (!nextQ && resp?.next) nextQ = resp.next;
      if (nextQ) {
        const qText = nextQ.question || nextQ.text || '';
        const qId = nextQ.id || nextQ.questionId || nextQ._id || null;
        setQuestion(qText);
        setQuestionId(qId);
        setMessages(prev => [...prev, { role: 'assistant', text: qText }]);
      }
      setAnswer('');
    } catch (e) {
      setError(e?.message || 'Failed to submit answer');
    } finally {
      setBusy(false);
    }
  };

  const speakText = useMemo(() => (question || ''), [question]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Interview</h1>
        <p className="muted">Mode: {mode.toUpperCase()}</p>
      </div>

      {error ? <div className="error">{error}</div> : null}
      {busy && !question ? <div className="loading">Loading…</div> : null}

      <div className="grid two">
        <div>
          <ChatPanel messages={messages} />
          <form className="card" style={{ background: theme.surface }} onSubmit={onSubmit}>
            <div className="card-header">
              <h3>Answer</h3>
            </div>
            <div className="card-body">
              <div className="question-block">
                <div className="muted">Question</div>
                <div className="question-text">{question || '—'}</div>
              </div>
              <textarea
                className="textarea"
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use the microphone…"
              />
              <VoiceControls onTranscript={onTranscript} speakText={speakText} />
            </div>
            <div className="card-footer">
              <button className="btn" type="submit" disabled={!canSubmit}>
                {busy ? 'Submitting…' : 'Submit Answer'}
              </button>
            </div>
          </form>
        </div>
        <div>
          <FeedbackPanel feedback={feedback} score={score} />
        </div>
      </div>
    </div>
  );
}
