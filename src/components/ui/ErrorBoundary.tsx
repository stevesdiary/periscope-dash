import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h2 className="text-lg font-semibold text-on-surface mb-2">Something went wrong</h2>
          <p className="text-sm text-on-surface-variant max-w-sm mb-3">
            An unexpected error occurred while rendering this page.
          </p>
          {this.state.error?.message && (
            <div className="bg-surface-container-low border border-outline rounded-lg px-4 py-2.5 mb-5 font-mono text-xs text-on-surface-variant text-left max-w-md">
              <p>error: <span className="text-danger">{this.state.error.message}</span></p>
            </div>
          )}
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="btn-primary gap-1.5"
          >
            <RefreshCw size={13} />Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
