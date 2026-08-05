import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders "Active" for active status', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders "Degraded" for degraded status', () => {
    render(<StatusBadge status="degraded" />);
    expect(screen.getByText('Degraded')).toBeInTheDocument();
  });

  it('renders "Down" for down status', () => {
    render(<StatusBadge status="down" />);
    expect(screen.getByText('Down')).toBeInTheDocument();
  });

  it('renders "Past due" for past_due status', () => {
    render(<StatusBadge status="past_due" />);
    expect(screen.getByText('Past due')).toBeInTheDocument();
  });

  it('renders "Trialing" for trialing status', () => {
    render(<StatusBadge status="trialing" />);
    expect(screen.getByText('Trialing')).toBeInTheDocument();
  });

  it('renders "Suspended" for suspended status', () => {
    render(<StatusBadge status="suspended" />);
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });

  it('renders "Cancelled" for cancelled status', () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders "Paused" for paused status', () => {
    render(<StatusBadge status="paused" />);
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StatusBadge status="active" className="my-class" />);
    const badge = screen.getByText('Active').closest('span')!;
    expect(badge.className).toContain('my-class');
  });

  it('includes a dot indicator', () => {
    render(<StatusBadge status="active" />);
    const dot = document.querySelector('.bg-current');
    expect(dot).toBeInTheDocument();
  });
});
