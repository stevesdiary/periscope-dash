import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton, SkeletonCard, SkeletonTable } from '../Skeleton';

describe('Skeleton', () => {
  it('renders a div with skeleton class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('skeleton');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-32');
  });
});

describe('SkeletonCard', () => {
  it('renders a card with 3 skeleton lines', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });
});

describe('SkeletonTable', () => {
  it('renders default 6 rows', () => {
    const { container } = render(<SkeletonTable />);
    const rows = container.querySelectorAll('.border-b');
    // 1 header + 6 data rows = 7
    expect(rows.length).toBe(7);
  });

  it('renders custom row count', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const rows = container.querySelectorAll('.border-b');
    expect(rows.length).toBe(4); // 1 header + 3 data rows
  });
});
