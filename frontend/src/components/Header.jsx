import React from 'react';
import { Camera, Cpu, Radio, Settings, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

export default function Header({ isWsConnected, telemetry, onOpenSettings }) {
  const cameraActive = telemetry?.camera_status === 'ACTIVE';
  const aiEngineActive = telemetry?.settings?.gesture_control_enabled;

  return (
    <header className="glass-panel sticky top-0 z-40 px-6 py-4 border-b border-slate-800/80 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Project Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-100 via-cyan-100 to-emerald-300 bg-clip-text text-transparent">
              AI-Powered Gesture-Based Smart HCI & IoT System
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Human-Computer Interaction & Virtual IoT Control Engine • Final-Year Engineering System
            </p>
          </div>
        </div>

        {/* Real-time Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Connection Status */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            isWsConnected 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10' 
              : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
          }`}>
            {isWsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isWsConnected ? 'System Online' : 'Connecting...'}
          </div>

          {/* Camera Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            cameraActive 
              ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}>
            <Camera className="w-3.5 h-3.5" />
            {cameraActive ? 'Camera Active' : 'Camera Idle'}
          </div>

          {/* AI Engine Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            aiEngineActive 
              ? 'bg-purple-950/60 text-purple-400 border-purple-500/30' 
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            {aiEngineActive ? 'AI Engine Ready' : 'AI Paused'}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition duration-200"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
