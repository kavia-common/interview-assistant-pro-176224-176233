import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Helper to render App with initial entries (route)
function renderWithRoute(route = '/') {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
}

describe('App routing smoke tests', () => {
  beforeEach(() => {
    // Ensure no real network requests leak
    jest.spyOn(global, 'fetch').mockReset();
    localStorage.clear();
  });

  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('redirects unauthenticated users to Login when visiting /dashboard', async () => {
    // clear token
    localStorage.removeItem('token');
    renderWithRoute('/dashboard');

    // Login view elements
    expect(await screen.findByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  test('shows Register page on /register', async () => {
    localStorage.removeItem('token');
    renderWithRoute('/register');

    expect(await screen.findByRole('heading', { name: /Create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
  });

  test('authenticated user sees Dashboard', async () => {
    // simulate logged-in by setting any token
    localStorage.setItem('token', 'dummy');
    renderWithRoute('/dashboard');

    expect(await screen.findByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/Practice interviews/i)).toBeInTheDocument();
  });

  test('authenticated user can navigate to Reports route', async () => {
    localStorage.setItem('token', 'dummy');
    // Mock reports list call
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );

    renderWithRoute('/reports');

    // There may be a loading indicator first
    await waitFor(() => {
      // Header
      expect(screen.getByRole('heading', { name: /Reports/i })).toBeInTheDocument();
    });
  });

  test('authenticated user can open Interview route', async () => {
    localStorage.setItem('token', 'dummy');
    // Mock minimal API responses to avoid real network
    global.fetch = jest.fn()
      // For startInterview
      .mockResolvedValueOnce(new Response(JSON.stringify({ sessionId: 'S1', firstQuestion: { id: 'Q1', question: 'Tell me about yourself?' } }), { status: 200, headers: { 'Content-Type': 'application/json' } }));

    renderWithRoute('/interview?mode=hr');

    expect(await screen.findByRole('heading', { name: /Interview/i })).toBeInTheDocument();
    expect(await screen.findByText(/Tell me about yourself\?/i)).toBeInTheDocument();
  });
});
