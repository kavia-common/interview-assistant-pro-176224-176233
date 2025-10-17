import { getApiBaseUrl, apiRequest, api } from '../client';

// Helper to create a mocked Response object
function createJsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || { 'Content-Type': 'application/json' });
  return new Response(JSON.stringify(body), { status: 200, headers, ...init });
}

describe('api client - getApiBaseUrl', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('returns empty string when not set', () => {
    delete process.env.REACT_APP_API_BASE_URL;
    expect(getApiBaseUrl()).toBe('');
  });

  test('trims trailing slashes', () => {
    process.env.REACT_APP_API_BASE_URL = 'http://localhost:3001////';
    expect(getApiBaseUrl()).toBe('http://localhost:3001');
  });
});

describe('api client - apiRequest', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
    localStorage.clear();
  });

  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('performs GET with JSON response', async () => {
    const data = { hello: 'world' };
    global.fetch = jest.fn().mockResolvedValue(createJsonResponse(data));

    const res = await apiRequest('/ping', { method: 'GET' });
    expect(res).toEqual(data);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/ping$/);
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  test('attaches Authorization when token exists', async () => {
    localStorage.setItem('token', 'abc123');
    global.fetch = jest.fn().mockResolvedValue(createJsonResponse({ ok: true }));

    await apiRequest('/secure', { method: 'GET' });
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.headers.Authorization).toBe('Bearer abc123');
  });

  test('throws with message and status on non-OK', async () => {
    const body = { message: 'Bad things happened' };
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(body), { status: 400, headers: { 'Content-Type': 'application/json' } })
    );

    await expect(apiRequest('/oops', { method: 'GET' })).rejects.toMatchObject({
      message: 'Bad things happened',
      status: 400
    });
  });

  test('supports text response bodies', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response('plain text', { status: 200, headers: { 'Content-Type': 'text/plain' } })
    );

    const res = await apiRequest('/text', { method: 'GET' });
    expect(res).toBe('plain text');
  });
});

describe('api client - facade methods', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });
  afterAll(() => {
    global.fetch && global.fetch.mockRestore && global.fetch.mockRestore();
  });

  test('login posts payload', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      createJsonResponse({ token: 't1' })
    );
    const payload = { email: 'a@b.com', password: 'x' };
    const result = await api.login(payload);
    expect(result).toEqual({ token: 't1' });
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/auth\/login$/);
    expect(opts.method).toBe('POST');
    expect(opts.body).toBe(JSON.stringify(payload));
  });

  test('startInterview posts mode and returns session', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      createJsonResponse({ sessionId: 'S1' })
    );
    const res = await api.startInterview({ mode: 'hr' });
    expect(res.sessionId).toBe('S1');
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/interview\/start$/);
    expect(opts.method).toBe('POST');
  });

  test('nextQuestion builds query string', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      createJsonResponse({ id: 'Q2', question: 'Why us?' })
    );
    const res = await api.nextQuestion('S1');
    expect(res.id).toBe('Q2');
    const [url] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/question\/next\?session_id=S1$/);
  });
});
