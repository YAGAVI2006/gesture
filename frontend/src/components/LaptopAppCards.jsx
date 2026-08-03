import React, { useState } from 'react';
import { FileText, Camera, Calculator, Globe, Terminal, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { launchApp } from '../services/api';

const LAPTOP_APPS = [
  { key: 'notepad', name: 'Notepad', icon: FileText, gesture: 'Pinch 🤏', shortcut: 'N', color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400' },
  { key: 'camera', name: 'Camera App', icon: Camera, gesture: 'Fist ✊', shortcut: 'C', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400' },
  { key: 'calculator', name: 'Calculator', icon: Calculator, gesture: 'Peace ✌️', shortcut: 'CALC', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
  { key: 'browser', name: 'Chrome Browser', icon: Globe, gesture: 'Thumbs Up 👍', shortcut: 'WEB', color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400' },
  { key: 'terminal', name: 'Command Prompt', icon: Terminal, gesture: 'Open Palm ✋', shortcut: 'CMD', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400' }
];

export default function LaptopAppCards({ telemetry }) {
  const [loadingApp, setLoadingApp] = useState(null);
  const [lastLaunched, setLastLaunched] = useState(telemetry?.last_app_launched || 'None');

  const handleLaunch = async (appKey, appName) => {
    setLoadingApp(appKey);
    try {
      const res = await launchApp(appKey);
      if (res.status === 'success') {
        setLastLaunched(appName);
      }
    } catch (err) {
      console.error('App launch error:', err);
    } finally {
      setLoadingApp(null);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Laptop System Applications</h2>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
          Direct OS Execution
        </span>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {LAPTOP_APPS.map((app) => {
          const Icon = app.icon;
          const isLoading = loadingApp === app.key;
          const isRecentlyLaunched = telemetry?.last_app_launched?.toLowerCase().includes(app.name.toLowerCase());

          return (
            <div
              key={app.key}
              className={`p-3 rounded-xl bg-gradient-to-b ${app.color} border flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 text-slate-300">
                    {app.gesture}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-100 mb-1">{app.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono">Trigger: {app.gesture}</p>
              </div>

              <button
                onClick={() => handleLaunch(app.key, app.name)}
                disabled={isLoading}
                className="mt-3 w-full py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700/80 transition"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                )}
                Launch
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
