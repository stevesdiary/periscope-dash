import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { TotpLoginPage } from '../TotpLoginPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLoginTotp = vi.fn();
vi.mock('../../api/client', () => ({
  api: {
    login: vi.fn(),
    loginTotp: (...args: unknown[]) => mockLoginTotp(...args),
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
  mockLoginTotp.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('TotpLoginPage', () => {
  it('renders the verification heading', () => {
    render(<TotpLoginPage />, { wrapper });
    expect(screen.getByText('Enter your verification code')).toBeInTheDocument();
  });

  it('renders 6 OTP input boxes', () => {
    render(<TotpLoginPage />, { wrapper });
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(6);
  });

  it('renders countdown timer', () => {
    render(<TotpLoginPage />, { wrapper });
    expect(screen.getByText(/expires in/)).toBeInTheDocument();
  });

  it('toggles to recovery code input', () => {
    render(<TotpLoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Use a recovery code instead'));
    expect(screen.getByPlaceholderText('xxxx-xxxx')).toBeInTheDocument();
  });

  it('toggles back to authenticator app', () => {
    render(<TotpLoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Use a recovery code instead'));
    fireEvent.click(screen.getByText('Use authenticator app instead'));
    expect(screen.getAllByRole('textbox').length).toBe(6);
  });

  it('shows validation error when submitting empty code', async () => {
    render(<TotpLoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Verify'));
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid code.')).toBeInTheDocument();
    });
  });

  it('calls loginTotp and navigates on success', async () => {
    sessionStorage.setItem('mfa_token', 'mfa-tok');
    mockLoginTotp.mockResolvedValue({
      accessToken: 'jwt-456',
      user: { email: 'a@b.com', role: 'super-admin', permissions: [] },
    });

    render(<TotpLoginPage />, { wrapper });
    // Type 6 digits
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input, i) => {
      fireEvent.change(input, { target: { value: String(i + 1) } });
    });

    fireEvent.click(screen.getByText('Verify'));

    await waitFor(() => {
      expect(mockLoginTotp).toHaveBeenCalledWith('mfa-tok', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('navigates back to /login', () => {
    render(<TotpLoginPage />, { wrapper });
    fireEvent.click(screen.getByText('Back to sign in'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
