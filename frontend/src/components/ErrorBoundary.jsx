import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught UI Error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-rose-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Dashboard UI Encountered an Error</h2>
            <p className="text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 break-words text-left">
              {this.state.error?.toString() || 'Unknown UI Error'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload System Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
