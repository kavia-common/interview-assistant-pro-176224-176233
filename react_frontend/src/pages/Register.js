import React, { useState } from 'react';
import { api } from '../api/client';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form that calls /auth/register and stores JWT if returned. */
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.register({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ background: theme.surface }}>
      <div className="card-header">
        <h2>Create account</h2>
        <p className="muted">Register to start your practice</p>
      </div>
      <form onSubmit={onSubmit} className="form">
        <label className="label">Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        {error ? <div className="error">{error}</div> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <div className="card-footer">
        <span className="muted">Have an account? </span>
        <Link to="/login" className="link">Sign in</Link>
      </div>
    </div>
  );
}
