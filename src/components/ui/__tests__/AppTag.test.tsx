import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppTag } from '../AppTag';

describe('AppTag', () => {
  it('renders product name for known app keys', () => {
    render(<AppTag appKey="estate" />);
    expect(screen.getByText('Estate')).toBeInTheDocument();
  });

  it('renders "Logistics" for logistics key', () => {
    render(<AppTag appKey="logistics" />);
    expect(screen.getByText('Logistics')).toBeInTheDocument();
  });

  it('renders "School" for school key', () => {
    render(<AppTag appKey="school" />);
    expect(screen.getByText('School')).toBeInTheDocument();
  });

  it('renders "Hospital" for hospital key', () => {
    render(<AppTag appKey="hospital" />);
    expect(screen.getByText('Hospital')).toBeInTheDocument();
  });

  it('falls back to appKey for unknown keys', () => {
    render(<AppTag appKey="unknown-product" />);
    expect(screen.getByText('unknown-product')).toBeInTheDocument();
  });

  it('renders a colored dot', () => {
    render(<AppTag appKey="estate" />);
    const dot = document.querySelector('.rounded-full')!;
    expect(dot).toBeInTheDocument();
  });
});
