/** Centralized API client using REACT_APP_API_BASE_URL and attaching JWT if present. */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the API base URL read from environment. */
  const base = process.env.REACT_APP_API_BASE_URL || "";
  return base.replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns JWT token from localStorage if available. */
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /** Perform a fetch to the backend with JWT header when available. */
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";

  let body;
  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const message =
      (body && body.message) ||
      (typeof body === "string" ? body : "Request failed");
    const err = new Error(message);
    err.status = response.status;
    err.body = body;
    throw err;
  }
  return body;
}

// PUBLIC_INTERFACE
export const api = {
  // Auth
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  // Interview
  startInterview: (payload) => apiRequest("/interview/start", { method: "POST", body: JSON.stringify(payload) }),
  submitAnswer: (payload) => apiRequest("/interview/answer", { method: "POST", body: JSON.stringify(payload) }),

  // Question
  nextQuestion: (sessionId) => apiRequest(`/question/next?session_id=${encodeURIComponent(sessionId)}`, { method: "GET" }),

  // Reports
  myReports: () => apiRequest("/report/my", { method: "GET" }),
  sessionReport: (sessionId) => apiRequest(`/report/session/${encodeURIComponent(sessionId)}`, { method: "GET" }),

  // Feedback
  feedbackByResponse: (responseId) => apiRequest(`/feedback/${encodeURIComponent(responseId)}`, { method: "GET" }),
  feedbackBySession: (sessionId) => apiRequest(`/feedback/session/${encodeURIComponent(sessionId)}`, { method: "GET" }),
};
