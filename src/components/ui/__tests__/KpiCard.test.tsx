import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '../KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="MRR" value="₦48,250" />);
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('₦48,250')).toBeInTheDocument();
  });

  it('renders positive delta', () => {
    render(<KpiCard label="Users" value="1,200" delta={{ value: '+12%', positive: true }} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('renders negative delta', () => {
    render(<KpiCard label="Churn" value="3%" delta={{ value: '-2%', positive: false }} />);
    expect(screen.getByText('-2%')).toBeInTheDocument();
  });

  it('renders subline when provided', () => {
    render(<KpiCard label="Revenue" value="₦100k" subline="vs last month" />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('applies danger styling when danger prop is true', () => {
    render(<KpiCard label="Alert" value="5" danger />);
    const card = screen.getByText('Alert').closest('.card')!;
    expect(card.className).toContain('border-danger');
  });

  it('does not render subline when not provided', () => {
    render(<KpiCard label="MRR" value="₦0" />);
    expect(screen.queryByText(/vs last month/)).not.toBeInTheDocument();
  });
});
