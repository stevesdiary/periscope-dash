import { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MOCK_SUPPORT_TICKETS } from '../lib/mockData';
import { clsx } from 'clsx';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-muted',
};

type TabFilter = 'open' | 'pending' | 'closed';

export function SupportPage() {
  const [tab, setTab] = useState<TabFilter>('open');
  const [selected, setSelected] = useState(MOCK_SUPPORT_TICKETS[0]);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const tickets = MOCK_SUPPORT_TICKETS.filter(t => tab === 'open' ? t.status === 'open' : tab === 'pending' ? t.status === 'pending' : t.status === 'closed');

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left: ticket list */}
      <div className="w-full lg:w-[380px] flex-shrink-0 border-r border-outline flex flex-col bg-white">
        <div className="px-4 py-3 border-b border-outline">
          <h1 className="text-base font-semibold text-on-surface mb-2">Support tickets</h1>
          <div className="flex rounded-lg border border-outline overflow-hidden bg-surface-container-low">
            {(['open', 'pending', 'closed'] as TabFilter[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx('flex-1 h-7 text-xs font-medium capitalize transition-colors',
                  tab === t ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                )}>
                {t}
                <span className={clsx('ml-1 px-1 rounded-full text-[10px]',
                  tab === t ? 'bg-white/20 text-white' : 'bg-surface-container text-muted'
                )}>
                  {MOCK_SUPPORT_TICKETS.filter(tk => tk.status === t).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-outline">
          {tickets.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">No {tab} tickets</div>
          ) : tickets.map(t => (
            <div key={t.id} onClick={() => setSelected(t)}
              className={clsx('px-4 py-3 cursor-pointer hover:bg-surface-container-low transition-colors',
                selected?.id === t.id && 'bg-primary-tint/30 border-l-2 border-primary'
              )}>
              <div className="flex items-start gap-2.5">
                <span className={clsx('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', PRIORITY_COLORS[t.priority])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-on-surface truncate">{t.subject}</p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {t.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                      <span className="text-xs text-muted">{t.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{t.business}</p>
                  <p className="text-xs text-muted truncate">{t.requester}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mx-auto mb-3">
                <Send size={20} className="text-muted" />
              </div>
              <p className="text-sm font-medium text-on-surface">Select a ticket to view details</p>
            </div>
          </div>
        ) : (
          <>
            {/* Ticket header */}
            <div className="bg-white border-b border-outline px-5 py-3 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', PRIORITY_COLORS[selected.priority])} />
                  <h2 className="text-base font-semibold text-on-surface">{selected.subject}</h2>
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                    selected.priority === 'high' ? 'bg-danger-bg text-danger' :
                    selected.priority === 'medium' ? 'bg-warning-bg text-warning' : 'bg-surface-container text-muted'
                  )}>
                    {selected.priority}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{selected.requester} · {selected.time}</p>
              </div>
              <select className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none">
                <option>Open</option>
                <option>Pending</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Business context card */}
              <div className="card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Business context</p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{selected.business}</p>
                    <p className="text-xs font-mono text-muted">{selected.businessId}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status="active" />
                      <span className="text-xs text-on-surface-variant">Growth plan · $2,000 MRR</span>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:underline flex-shrink-0">View business →</button>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={clsx('flex gap-3', msg.from.includes('periscope') && 'flex-row-reverse')}>
                    <div className="w-7 h-7 rounded-full bg-primary-tint flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                      {msg.from[0].toUpperCase()}
                    </div>
                    <div className={clsx('max-w-[75%]', msg.from.includes('periscope') && 'items-end flex flex-col')}>
                      <div className={clsx('px-3 py-2.5 rounded-xl text-sm',
                        msg.internal ? 'bg-warning-bg border border-warning/20 text-on-surface' :
                        msg.from.includes('periscope') ? 'bg-primary text-white' : 'bg-white border border-outline text-on-surface'
                      )}>
                        {msg.internal && (
                          <div className="flex items-center gap-1 text-xs text-warning font-medium mb-1">
                            <Lock size={10} />Internal note
                          </div>
                        )}
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-muted mt-1">{msg.from} · {msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply composer */}
            <div className="bg-white border-t border-outline p-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setIsInternal(false)}
                  className={clsx('px-3 h-7 rounded-lg text-xs font-medium transition-colors',
                    !isInternal ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  )}>
                  Reply
                </button>
                <button onClick={() => setIsInternal(true)}
                  className={clsx('px-3 h-7 rounded-lg text-xs font-medium transition-colors flex items-center gap-1',
                    isInternal ? 'bg-warning-bg text-warning border border-warning/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  )}>
                  <Lock size={10} />Internal note
                </button>
              </div>
              <div className="flex gap-2">
                <textarea value={reply} onChange={e => setReply(e.target.value)}
                  placeholder={isInternal ? 'Add an internal note…' : 'Write a reply…'}
                  rows={2}
                  className={clsx('flex-1 px-3 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20',
                    isInternal ? 'border-warning/30 bg-warning-bg/30' : 'border-outline bg-white'
                  )} />
                <button className="btn-primary self-end px-3">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
