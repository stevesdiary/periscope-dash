import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { LoginPage } from '../LoginPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../../api/client', () => ({
  api: {
    login: (...args: unknown[]) => mockLogin(...args),
    loginTotp: vi.fn(),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  mockLogin.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('LoginPage', () => {
  it('renders the sign-in form', () => {
    render(<LoginPage />, { wrapper });
    expect(screen.getByText('Sign in to Periscope')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@periscope.local')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders demo account buttons', () => {
    render(<LoginPage />, { wrapper });
    expect(screen.getByText('super-admin')).toBeInTheDocument();
    expect(screen.getByText('support')).toBeInTheDocument();
    expect(screen.getByText('sales')).toBeInTheDocument();
  });

  it('demo buttons pre-fill email and password', () => {
    render(<LoginPage />, { wrapper });
    fireEvent.click(screen.getByText('support'));
    const email = screen.getByPlaceholderText('you@periscope.local') as HTMLInputElement;
    expect(email.value).toBe('support@periscope.local');
  });

  it('submits login and navigates to /dashboard on success', async () => {
    mockLogin.mockResolvedValue({
      accessToken: 'tok-123',
      user: { email: 'a@b.com', role: 'super-admin', permissions: [] },
    });

    render(<LoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Unauthorized'));

    render(<LoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    });
  });

  it('redirects to TOTP page when MFA is required', async () => {
    mockLogin.mockResolvedValue({ mfaRequired: true, mfaToken: 'mfa-123' });

    render(<LoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login/totp');
      expect(sessionStorage.getItem('mfa_token')).toBe('mfa-123');
    });
  });

  it('toggles password visibility', () => {
    render(<LoginPage />, { wrapper });
    const pwInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    expect(pwInput.type).toBe('password');
    const toggleBtn = pwInput.parentElement!.querySelector('button')!;
    fireEvent.click(toggleBtn);
    expect(pwInput.type).toBe('text');
  });
});
