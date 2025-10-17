const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Token storage helpers
const TOKEN_KEY = 'ia_jwt_token';

// PUBLIC_INTERFACE
export function getToken() {
  /** Retrieve JWT token from localStorage. */
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persist JWT token to localStorage. */
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clear auth token. */
  setToken(null);
}

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getToken();
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    data = await res.text().catch(() => '');
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Authentication endpoints */
  async login(payload) {
    /** POST /auth/login {email, password} -> {token} */
    const data = await request('/auth/login', { method: 'POST', body: payload });
    if (data?.token) setToken(data.token);
    return data;
  },
  async register(payload) {
    /** POST /auth/register {name, email, password} -> {token?} */
    const data = await request('/auth/register', { method: 'POST', body: payload });
    if (data?.token) setToken(data.token);
    return data;
  },

  /** Interview flow */
  async startInterview(payload) {
    /** POST /interview/start {mode} -> {sessionId, firstQuestion?} */
    return request('/interview/start', { method: 'POST', body: payload });
  },
  async nextQuestion(mode) {
    /** GET /question/next?mode=hr|technical -> {question, id} */
    const q = encodeURIComponent(mode || '');
    return request(`/question/next?mode=${q}`);
  },
  async submitAnswer(payload) {
    /** POST /interview/answer {sessionId, questionId, answer} -> {feedback, score, nextQuestion?} */
    return request('/interview/answer', { method: 'POST', body: payload });
  },

  /** Reports */
  async myReports() {
    /** GET /report/my -> list or summary */
    return request('/report/my', { method: 'GET' });
  },
  async sessionReport(id) {
    /** GET /report/session/{id} */
    return request(`/report/session/${encodeURIComponent(id)}`, { method: 'GET' });
  },
};
