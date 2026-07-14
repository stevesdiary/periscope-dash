import { clsx } from 'clsx';

type Status = 'active' | 'inactive' | 'suspended' | 'healthy' | 'degraded' | 'down' | 'past_due' | 'cancelled' | 'trialing' | 'paused' | 'invited';

const MAP: Record<Status, string> = {
  active:    'bg-success-bg text-success',
  healthy:   'bg-success-bg text-success',
  trialing:  'bg-info-bg text-info',
  inactive:  'bg-surface-container text-muted',
  cancelled: 'bg-surface-container text-muted',
  paused:    'bg-surface-container text-muted',
  invited:   'bg-surface-container text-on-surface-variant',
  suspended: 'bg-warning-bg text-warning',
  degraded:  'bg-warning-bg text-warning',
  past_due:  'bg-warning-bg text-warning',
  down:      'bg-danger-bg text-danger',
};

const LABELS: Record<Status, string> = {
  active: 'Active', inactive: 'Inactive', suspended: 'Suspended',
  healthy: 'Healthy', degraded: 'Degraded', down: 'Down',
  past_due: 'Past due', cancelled: 'Cancelled', trialing: 'Trialing',
  paused: 'Paused', invited: 'Invited',
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', MAP[status], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {LABELS[status]}
    </span>
  );
}
