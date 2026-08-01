import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OtpInput } from '../OtpInput';

describe('OtpInput', () => {
  const defaultProps = {
    value: ['', '', '', '', '', ''],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 6 input boxes', () => {
    render(<OtpInput {...defaultProps} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(6);
  });

  it('calls onChange when a digit is typed', () => {
    const onChange = vi.fn();
    render(<OtpInput value={['', '', '', '', '', '']} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '4' } });
    expect(onChange).toHaveBeenCalledWith(['4', '', '', '', '', '']);
  });

  it('strips non-numeric characters', () => {
    const onChange = vi.fn();
    render(<OtpInput value={['', '', '', '', '', '']} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalledWith(['', '', '', '', '', '']);
  });

  it('handles paste of 6 digits', () => {
    const onChange = vi.fn();
    render(<OtpInput value={['', '', '', '', '', '']} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => '123456' },
    });
    expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
  });

  it('shows error styling when error prop is true', () => {
    render(<OtpInput {...defaultProps} error />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].className).toContain('border-danger');
  });

  it('clears current digit on backspace', () => {
    const onChange = vi.fn();
    render(<OtpInput value={['1', '2', '', '', '', '']} onChange={onChange} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    expect(onChange).toHaveBeenCalledWith(['1', '', '', '', '', '']);
  });
});
