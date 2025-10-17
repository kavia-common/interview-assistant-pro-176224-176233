Centralized API usage

- Configure backend URL in .env:
  REACT_APP_API_BASE_URL=http://localhost:3001

- Optional voice feature flag:
  REACT_APP_VOICE_ENABLED=false

- Use the shared API client:

  import { api } from "./src/api";

  // Auth
  await api.register({ email, password });
  const { token } = await api.login({ email, password });
  localStorage.setItem("token", token);

  // Interview
  const { session_id } = await api.startInterview({ role: "Frontend" });
  const q = await api.nextQuestion(session_id);
  const res = await api.submitAnswer({ session_id, question_id: q.id, answer_text: "..." });

  // Reports
  const my = await api.myReports();
  const report = await api.sessionReport(session_id);

  // Feedback
  const f1 = await api.feedbackByResponse(res.response_id);
  const f2 = await api.feedbackBySession(session_id);
