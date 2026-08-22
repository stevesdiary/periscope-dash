import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Aperture } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('superadmin@periscope.local');
  const [password, setPassword] = useState('superadmin-pass');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.mfaRequired && res.mfaToken) {
        sessionStorage.setItem('mfa_token', res.mfaToken);
        navigate('/login/totp');
      } else if (res.accessToken && res.user) {
        login(res.accessToken, res.user);
        navigate('/dashboard');
      }
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login shortcut
  const demoLogin = (role: string) => {
    const accounts: Record<string, { email: string; password: string }> = {
      'super-admin': { email: 'superadmin@periscope.local', password: 'superadmin-pass' },
      'support': { email: 'support@periscope.local', password: 'support-pass' },
      'sales': { email: 'sales@periscope.local', password: 'sales-pass' },
    };
    const acc = accounts[role];
    if (acc) { setEmail(acc.email); setPassword(acc.password); }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] bg-gradient-to-br from-primary-tint via-white to-white p-12 border-r border-outline">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Aperture size={20} className="text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-on-surface">Periscope</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">IOP</p>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold text-on-surface leading-tight mb-4">
            One command center for the whole portfolio
          </h1>
          <p className="text-base text-on-surface-variant mb-8">
            Revenue, businesses, users, health — across Estate, School, Hospital, Logistics and Hospitality — aggregated into one internal dashboard.
          </p>
          <div className="flex items-center gap-3">
            {['Estate', 'School', 'Hospital', 'Logistics', 'Hospitality'].map((p) => (
              <span key={p} className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-outline text-on-surface-variant shadow-card">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Shield size={12} />
          <span>Internal access only · Protected by two-factor authentication</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Aperture size={16} className="text-white" />
          </div>
          <span className="text-base font-semibold text-on-surface">Periscope</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-on-surface">Sign in to Periscope</h2>
            <p className="text-sm text-muted mt-1">Internal access only</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-danger-bg border border-danger/20 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@periscope.local"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-on-surface">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-10 text-sm">
              {loading ? 'Signing in…' : 'Continue'}
            </button>

            <button type="button" className="w-full text-center text-sm text-primary hover:underline">
              Forgot password?
            </button>
          </form>

          {/* Demo shortcuts */}
          <div className="mt-6 pt-5 border-t border-outline">
            <p className="text-xs text-muted text-center mb-3">Demo accounts</p>
            <div className="flex gap-2">
              {['super-admin', 'support', 'sales'].map(role => (
                <button key={role} onClick={() => demoLogin(role)}
                  className="flex-1 py-1.5 rounded-lg border border-outline text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors capitalize">
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted flex items-center justify-center gap-1">
            <Shield size={11} />Protected by two-factor authentication
          </p>
        </div>
      </div>
    </div>
  );
}
