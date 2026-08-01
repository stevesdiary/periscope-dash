import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no user and no token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('login stores token and user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { email: 'admin@test.com', role: 'super-admin', permissions: ['system.read'] };

    act(() => {
      result.current.login('jwt-token-123', user);
    });

    expect(result.current.token).toBe('jwt-token-123');
    expect(result.current.user).toEqual(user);
    expect(localStorage.getItem('periscope_token')).toBe('jwt-token-123');
  });

  it('logout clears token and user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { email: 'admin@test.com', role: 'super-admin', permissions: ['system.read'] };

    act(() => {
      result.current.login('jwt-token-123', user);
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('periscope_token')).toBeNull();
  });

  it('hasPermission returns true when permission is present', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { email: 'a@b.com', role: 'super-admin', permissions: ['system.read', 'user.read'] };

    act(() => {
      result.current.login('tok', user);
    });

    expect(result.current.hasPermission('system.read')).toBe(true);
    expect(result.current.hasPermission('user.read')).toBe(true);
  });

  it('hasPermission returns false when permission is absent', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { email: 'a@b.com', role: 'sales', permissions: ['business.read'] };

    act(() => {
      result.current.login('tok', user);
    });

    expect(result.current.hasPermission('system.write')).toBe(false);
  });

  it('hasPermission returns false when no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.hasPermission('anything')).toBe(false);
  });

  it('restores session from localStorage on mount', () => {
    const user = { email: 'a@b.com', role: 'support', permissions: ['user.read'] };
    localStorage.setItem('periscope_token', 'saved-token');
    localStorage.setItem('periscope_user', JSON.stringify(user));

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.token).toBe('saved-token');
    expect(result.current.user).toEqual(user);
  });
});
