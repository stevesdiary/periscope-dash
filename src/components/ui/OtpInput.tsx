import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { clsx } from 'clsx';

interface OtpInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  error?: boolean;
}

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (i: number, char: string) => {
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[i]) { update(i, ''); }
      else if (i > 0) { refs.current[i - 1]?.focus(); update(i - 1, ''); }
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = Array(6).fill('');
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={e => update(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={e => onKey(i, e)}
          onPaste={onPaste}
          className={clsx(
            'w-12 h-14 text-center text-2xl font-semibold tabular rounded-lg border bg-white transition-all outline-none',
            'focus:ring-2 focus:ring-primary/30 focus:border-primary',
            error ? 'border-danger bg-danger-bg/20' : 'border-outline'
          )}
        />
      ))}
    </div>
  );
}
