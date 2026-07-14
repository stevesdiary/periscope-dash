import { useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function ForbiddenPage({ permission }: { permission?: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Lock size={28} className="text-muted" />
      </div>
      <h2 className="text-lg font-semibold text-on-surface mb-2">You don't have access to this</h2>
      <p className="text-sm text-on-surface-variant max-w-sm mb-1">
        Your role (<span className="font-medium capitalize">{user?.role}</span>) doesn't include the permission required for this page
        {permission && <> (<code className="font-mono text-xs bg-surface-container px-1 rounded">{permission}</code>)</>}.
      </p>
      <p className="text-sm text-muted mb-6">Contact a super-admin if you need access.</p>
      <button onClick={() => navigate('/businesses')} className="btn-primary">
        Back to Businesses
      </button>
    </div>
  );
}

export function ErrorPage({ code, message, correlationId, onRetry }: {
  code?: string;
  message?: string;
  correlationId?: string;
  onRetry?: () => void;
}) {
  const copy = () => correlationId && navigator.clipboard.writeText(correlationId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <h2 className="text-lg font-semibold text-on-surface mb-2">Something went wrong</h2>
      <p className="text-sm text-on-surface-variant max-w-sm mb-3">
        {message ?? "We couldn't load this data. A downstream product API returned an error."}
      </p>
      {(code || correlationId) && (
        <div className="bg-surface-container-low border border-outline rounded-lg px-4 py-2.5 mb-5 font-mono text-xs text-on-surface-variant text-left">
          {code && <p>code: <span className="text-danger">{code}</span></p>}
          {correlationId && <p>correlationId: {correlationId}</p>}
        </div>
      )}
      <div className="flex gap-2">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary gap-1.5">
            <RefreshCw size={13} />Retry
          </button>
        )}
        {correlationId && (
          <button onClick={copy} className="btn-secondary gap-1.5">
            <Copy size={13} />Copy correlation ID
          </button>
        )}
      </div>
    </div>
  );
}
