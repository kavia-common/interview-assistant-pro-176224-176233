import React, { useState } from 'react';
import { api } from '../api/client';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form that calls /auth/login and stores JWT. */
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ background: theme.surface }}>
      <div className="card-header">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue</p>
      </div>
      <form onSubmit={onSubmit} className="form">
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        {error ? <div className="error">{error}</div> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="card-footer">
        <span className="muted">No account? </span>
        <Link to="/register" className="link">Create one</Link>
      </div>
    </div>
  );
}
