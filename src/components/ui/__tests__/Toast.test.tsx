import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../Toast';

function TestTrigger() {
  const { toast } = useToast();
  return (
    <>
      <button onClick={() => toast('success', 'Saved!')}>success</button>
      <button onClick={() => toast('error', 'Failed!')}>error</button>
    </>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a success toast when triggered', () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('shows an error toast when triggered', () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('error'));
    expect(screen.getByText('Failed!')).toBeInTheDocument();
  });

  it('auto-dismisses after 4 seconds', () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('can be manually dismissed', () => {
    render(
      <ToastProvider>
        <TestTrigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    const dismissButtons = document.querySelectorAll('.fixed button');
    fireEvent.click(dismissButtons[dismissButtons.length - 1]);
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });
});
