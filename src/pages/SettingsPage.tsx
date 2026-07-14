import { useState } from 'react';
import { Shield, Key, Monitor, Check, X, Eye, EyeOff } from 'lucide-react';
import { OtpInput } from '../components/ui/OtpInput';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { useToast } from '../components/ui/Toast';
import { clsx } from 'clsx';

type SubPage = 'profile' | 'security' | 'notifications';

const SESSIONS = [
  { device: 'Chrome on macOS', location: 'Lagos, NG', ip: '102.89.x.x', lastActive: 'Current session', current: true },
  { device: 'Safari on iPhone', location: 'Lagos, NG', ip: '102.89.x.x', lastActive: '2d ago', current: false },
];

function DisableTotpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.totpDisable(otp.join(''));
      toast('success', 'Two-factor authentication disabled.');
      onSuccess();
    } catch {
      setError('Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-[400px] p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-on-surface">Confirm it's you</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-container-low"><X size={16} /></button>
        </div>
        <p className="text-sm text-on-surface-variant mb-5">
          Enter your current 6-digit code to disable two-factor authentication.
        </p>
        {error && <p className="text-sm text-danger text-center mb-3">{error}</p>}
        <OtpInput value={otp} onChange={setOtp} error={!!error} />
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={submit} disabled={loading || otp.some(v => !v)} className="btn-destructive flex-1">
            {loading ? 'Disabling…' : 'Disable 2FA'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subPage, setSubPage] = useState<SubPage>('security');
  const [totpEnabled, setTotpEnabled] = useState(true);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const SUB_NAV: { key: SubPage; label: string; icon: typeof Shield }[] = [
    { key: 'profile', label: 'Profile', icon: Monitor },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Key },
  ];

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h1 className="text-2xl font-semibold text-on-surface mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sub-nav */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5">
            {SUB_NAV.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSubPage(key)}
                className={clsx('flex items-center gap-2.5 w-full px-3 h-9 rounded-lg text-sm font-medium transition-colors',
                  subPage === key ? 'bg-primary-tint text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
                )}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {subPage === 'profile' && (
            <div className="card p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4">Profile</h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold">
                  {user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{user?.email?.split('@')[0] ?? 'Admin'}</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-tint text-primary mt-1 capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {subPage === 'security' && (
            <>
              {/* Password */}
              <div className="card p-5">
                <h2 className="text-base font-semibold text-on-surface mb-1">Change password</h2>
                <p className="text-xs text-muted mb-4">Last changed 3 months ago</p>
                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Current password</label>
                    <div className="relative">
                      <input type={showCurrentPw ? 'text' : 'password'} className="input pr-9" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowCurrentPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                        {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">New password</label>
                    <div className="relative">
                      <input type={showNewPw ? 'text' : 'password'} className="input pr-9" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowNewPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                        {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Confirm new password</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>
                  <button onClick={() => toast('success', 'Password updated successfully.')} className="btn-primary">
                    Update password
                  </button>
                </div>
              </div>

              {/* Two-factor */}
              <div className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-on-surface mb-1">Two-factor authentication</h2>
                    {totpEnabled ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
                            <Check size={10} />Enabled
                          </span>
                        </div>
                        <p className="text-xs text-muted">Authenticator app added on 12 Jun 2026</p>
                      </>
                    ) : (
                      <p className="text-sm text-on-surface-variant">Add an extra layer of security to your account.</p>
                    )}
                  </div>
                  <Shield size={20} className={totpEnabled ? 'text-success' : 'text-muted'} />
                </div>
                <div className="flex gap-2 mt-4">
                  {totpEnabled ? (
                    <>
                      <button className="btn-secondary text-xs">View recovery codes</button>
                      <button onClick={() => setShowDisableModal(true)} className="btn-destructive text-xs">
                        Disable two-factor
                      </button>
                    </>
                  ) : (
                    <button className="btn-primary text-xs">Set up two-factor</button>
                  )}
                </div>
              </div>

              {/* Active sessions */}
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
                  <h2 className="text-base font-semibold text-on-surface">Active sessions</h2>
                  <button onClick={() => toast('success', 'Signed out from all other devices.')}
                    className="text-xs text-danger hover:underline">Sign out everywhere</button>
                </div>
                <div className="divide-y divide-outline">
                  {SESSIONS.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Monitor size={16} className="text-on-surface-variant flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-on-surface">{s.device}</p>
                          <p className="text-xs text-muted">{s.location} · {s.ip} · {s.lastActive}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="text-xs text-success font-medium">Current</span>
                      ) : (
                        <button onClick={() => toast('success', 'Session revoked.')}
                          className="text-xs text-danger hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {subPage === 'notifications' && (
            <div className="card p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4">Notification preferences</h2>
              <p className="text-sm text-muted">Notification settings coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {showDisableModal && (
        <DisableTotpModal
          onClose={() => setShowDisableModal(false)}
          onSuccess={() => { setTotpEnabled(false); setShowDisableModal(false); }}
        />
      )}
    </div>
  );
}
