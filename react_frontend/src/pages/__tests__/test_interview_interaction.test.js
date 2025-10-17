import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';

// Utility to mock chained fetch calls with specific responses
function mockFetchSequence(responses) {
  const fn = jest.fn();
  responses.forEach(r => fn.mockResolvedValueOnce(r));
  global.fetch = fn;
  return fn;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('Interview flow - basic interaction', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'dummy');
    jest.spyOn(global, 'fetch').mockReset();
  });

  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('starts session, shows first question, submits answer, displays feedback and next question', async () => {
    // 1) startInterview returns session and firstQuestion
    // 2) submitAnswer returns feedback, score, and nextQuestion
    const firstQ = { id: 'Q1', question: 'Introduce yourself' };
    const nextQ = { id: 'Q2', question: 'Why do you want this job?' };
    mockFetchSequence([
      jsonResponse({ sessionId: 'S1', firstQuestion: firstQ }), // startInterview
      jsonResponse({ feedback: 'Good answer', score: 78, nextQuestion: nextQ }) // submitAnswer
    ]);

    // Navigate to /interview
    window.history.pushState({}, 'Interview', '/interview?mode=hr');

    render(<App />);

    // Page header
    expect(await screen.findByRole('heading', { name: /Interview/i })).toBeInTheDocument();
    // First question
    expect(await screen.findByText(/Introduce yourself/i)).toBeInTheDocument();

    // Type an answer and submit
    const textarea = screen.getByPlaceholderText(/Type your answer here/i);
    fireEvent.change(textarea, { target: { value: 'My name is Jane.' } });
    const submitBtn = screen.getByRole('button', { name: /Submit Answer/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    // Feedback visible
    await waitFor(async () => {
      expect(await screen.findByText(/Good answer/i)).toBeInTheDocument();
      expect(screen.getByText(/Score:\s*78\s*\/\s*100/i)).toBeInTheDocument();
    });

    // Next question bubbles in chat and question section updates
    expect(await screen.findByText(/Why do you want this job\?/i)).toBeInTheDocument();

    // Verify fetch calls made with expected endpoints
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const firstCallUrl = global.fetch.mock.calls[0][0];
    const secondCallUrl = global.fetch.mock.calls[1][0];
    expect(firstCallUrl).toMatch(/\/interview\/start$/);
    expect(secondCallUrl).toMatch(/\/interview\/answer$/);
  });
});
