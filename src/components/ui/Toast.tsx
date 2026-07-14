import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Toast { id: string; type: 'success' | 'error'; message: string; }
interface ToastCtx { toast: (type: Toast['type'], message: string) => void; }

const Ctx = createContext<ToastCtx>(null!);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-dropdown border text-sm font-medium animate-fade-in',
            t.type === 'success' ? 'bg-white border-success/30 text-on-surface' : 'bg-white border-danger/30 text-on-surface'
          )}>
            {t.type === 'success' ? <CheckCircle size={16} className="text-success flex-shrink-0" /> : <XCircle size={16} className="text-danger flex-shrink-0" />}
            {t.message}
            <button onClick={() => remove(t.id)} className="ml-2 text-muted hover:text-on-surface"><X size={14} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
