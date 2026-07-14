import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { OtpInput } from '../components/ui/OtpInput';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export function TotpLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [useRecovery, setUseRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(292); // 4:52

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const mfaToken = sessionStorage.getItem('mfa_token') ?? '';
    const code = useRecovery ? recoveryCode : otp.join('');
    if (!code || code.length < 6) { setError('Please enter a valid code.'); return; }
    setLoading(true);
    try {
      const res = await api.loginTotp(mfaToken, code);
      if (res.accessToken && res.user) {
        login(res.accessToken, res.user);
        navigate('/dashboard');
      }
    } catch {
      setError('Incorrect or expired code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-tint mb-4">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-on-surface">Enter your verification code</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Open your authenticator app and enter the 6-digit code for Periscope IOP.
          </p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg border border-danger/20 text-sm text-danger text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {!useRecovery ? (
              <>
                <OtpInput value={otp} onChange={setOtp} error={!!error} />
                <p className="text-center text-xs text-muted">
                  This challenge expires in <span className="font-medium tabular text-on-surface-variant">{fmt(seconds)}</span>
                </p>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Recovery code</label>
                <input
                  value={recoveryCode}
                  onChange={e => setRecoveryCode(e.target.value)}
                  placeholder="xxxx-xxxx"
                  className="input text-center font-mono tracking-widest"
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full h-10">
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button onClick={() => { setUseRecovery(v => !v); setError(''); }}
              className="text-sm text-primary hover:underline block w-full">
              {useRecovery ? 'Use authenticator app instead' : 'Use a recovery code instead'}
            </button>
            <button onClick={() => navigate('/login')}
              className="text-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1 mx-auto">
              <ArrowLeft size={14} />Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
