import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('Auth pages smoke tests', () => {
  beforeEach(() => {
    localStorage.removeItem('token');
    jest.spyOn(global, 'fetch').mockReset();
  });

  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('Login form fields render', async () => {
    window.history.pushState({}, 'Login', '/login');
    render(<App />);
    expect(await screen.findByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('Register form fields render', async () => {
    window.history.pushState({}, 'Register', '/register');
    render(<App />);

    expect(await screen.findByRole('heading', { name: /Create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('Login button click does not crash without mocked network', async () => {
    window.history.pushState({}, 'Login', '/login');
    render(<App />);
    const btn = await screen.findByRole('button', { name: /Sign in/i });
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });
});
