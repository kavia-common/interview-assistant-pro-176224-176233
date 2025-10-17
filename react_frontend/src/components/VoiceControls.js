import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../theme';

const VOICE_ENABLED = (process.env.REACT_APP_VOICE_ENABLED || 'true') === 'true';

// PUBLIC_INTERFACE
export default function VoiceControls({ onTranscript, speakText }) {
  /** Voice controls using Web Speech API for recognition and SpeechSynthesis for playback. */
  const { theme } = useTheme();
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!VOICE_ENABLED) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0]?.transcript)
          .join(' ')
          .trim();
        if (transcript && onTranscript) onTranscript(transcript);
      };
      recognitionRef.current.onend = () => setListening(false);
      setSupported(true);
    } else {
      setSupported(false);
    }
  }, [onTranscript]);

  const toggle = () => {
    if (!supported || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        // ignore start errors
      }
    }
  };

  const speak = () => {
    if (!speakText) return;
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(speakText);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  if (!VOICE_ENABLED) {
    return <div className="muted">Voice disabled</div>;
  }

  return (
    <div className="voice-controls" style={{ border: `1px solid ${theme.border}`, background: theme.surface }}>
      <button className={`btn ${listening ? 'btn-danger' : ''}`} onClick={toggle} disabled={!supported}>
        {supported ? (listening ? 'Stop Mic' : 'Start Mic') : 'Voice not supported'}
      </button>
      <button className="btn-secondary" onClick={speak} disabled={!speakText}>
        Play Question
      </button>
    </div>
  );
}
