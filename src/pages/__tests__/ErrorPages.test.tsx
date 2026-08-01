import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { ErrorPage, ForbiddenPage } from '../ErrorPages';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  localStorage.clear();
});

describe('ErrorPage', () => {
  it('renders default error message', () => {
    render(<ErrorPage />, { wrapper });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/couldn't load this data/)).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<ErrorPage message="Custom error" />, { wrapper });
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('renders error code when provided', () => {
    render(<ErrorPage code="BAD_GATEWAY" />, { wrapper });
    expect(screen.getByText('BAD_GATEWAY')).toBeInTheDocument();
  });

  it('renders correlation ID when provided', () => {
    render(<ErrorPage correlationId="trace-abc-123" />, { wrapper });
    expect(screen.getByText(/trace-abc-123/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorPage onRetry={onRetry} />, { wrapper });
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorPage />, { wrapper });
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });
});

describe('ForbiddenPage', () => {
  it('renders access denied message', () => {
    render(<ForbiddenPage />, { wrapper });
    expect(screen.getByText("You don't have access to this")).toBeInTheDocument();
  });

  it('renders permission code when provided', () => {
    render(<ForbiddenPage permission="system.read" />, { wrapper });
    expect(screen.getByText('system.read')).toBeInTheDocument();
  });

  it('navigates to /businesses when back button is clicked', () => {
    render(<ForbiddenPage />, { wrapper });
    fireEvent.click(screen.getByText('Back to Businesses'));
    expect(mockNavigate).toHaveBeenCalledWith('/businesses');
  });
});
