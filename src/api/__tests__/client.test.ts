import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the `request` helper logic by mocking fetch.
// Import the api module after setting up the mock.

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Dynamic import so the module sees the mocked fetch.
const { api } = await import('../../api/client');

beforeEach(() => {
  localStorage.clear();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('api client', () => {
  it('login sends correct payload', async () => {
    mockFetch.mockReturnValue(jsonResponse({ accessToken: 'tok', user: { email: 'a@b.com', role: 'super-admin', permissions: [] } }));

    const result = await api.login('a@b.com', 'pass123');

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/auth/login');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ email: 'a@b.com', password: 'pass123' });
    expect(result.accessToken).toBe('tok');
  });

  it('attaches Authorization header from localStorage', async () => {
    localStorage.setItem('periscope_token', 'my-jwt');
    mockFetch.mockReturnValue(jsonResponse([]));

    await api.getBusinesses();

    const [, opts] = mockFetch.mock.calls[0];
    expect(opts.headers['Authorization']).toBe('Bearer my-jwt');
  });

  it('generates a correlation id', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));

    await api.getDashboard();

    const [, opts] = mockFetch.mock.calls[0];
    expect(typeof opts.headers['x-correlation-id']).toBe('string');
    expect(opts.headers['x-correlation-id'].length).toBeGreaterThan(0);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockReturnValue(jsonResponse({ error: { code: 'UNAUTHORIZED' } }, 401));

    await expect(api.getUsers()).rejects.toMatchObject({ status: 401 });
  });

  it('getDashboard calls correct endpoint', async () => {
    mockFetch.mockReturnValue(jsonResponse({ kpis: {}, applications: [] }));
    await api.getDashboard();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('/internal/dashboard');
  });

  it('getBusinesses calls correct endpoint', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));
    await api.getBusinesses();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('/internal/businesses');
  });

  it('getFailedPayments passes limit query param', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));
    await api.getFailedPayments({ limit: 5 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('limit=5');
  });

  it('getAudit builds query string from params', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));
    await api.getAudit({ actor: 'admin', limit: 10 });
    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('actor=admin');
    expect(url).toContain('limit=10');
  });

  it('impersonate sends POST with adminId', async () => {
    mockFetch.mockReturnValue(jsonResponse({ accessToken: 'imp-tok', expiresIn: '1h', readOnly: true }));
    await api.impersonate(42);
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/internal/support/impersonate');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ adminId: 42 });
  });

  it('revokeSession sends DELETE method', async () => {
    mockFetch.mockReturnValue(jsonResponse({ revoked: true }));
    await api.revokeSession(7);
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toContain('/internal/security/sessions/7');
    expect(opts.method).toBe('DELETE');
  });
});
