import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('Routing and pages - smoke tests', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });

  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('Unauthenticated redirect to /login when accessing /dashboard', async () => {
    localStorage.removeItem('token');
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);
    expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
  });

  test('Register page renders on /register', async () => {
    localStorage.removeItem('token');
    window.history.pushState({}, 'Register', '/register');
    render(<App />);
    expect(await screen.findByText(/Create account/i)).toBeInTheDocument();
  });

  test('Authenticated Dashboard renders', async () => {
    localStorage.setItem('token', 't');
    window.history.pushState({}, 'Dashboard', '/dashboard');
    render(<App />);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice interviews/i)).toBeInTheDocument();
  });

  test('Reports page renders with loading state (authenticated)', async () => {
    localStorage.setItem('token', 't');
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    window.history.pushState({}, 'Reports', '/reports');
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Reports/i)).toBeInTheDocument());
  });
});
