import React from 'react';
import { Hand, Activity, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const GESTURE_ICONS = {
  'Open Palm': '✋',
  'Fist': '✊',
  'Thumbs Up': '👍',
  'Peace': '✌️',
  'Index Finger': '👆',
  'Pinch': '🤏',
  'Swipe Left': '👈',
  'Swipe Right': '👉',
  'Hand Detected': '🖐️',
  'No Hand': '🚫'
};

export default function GestureCard({ telemetry }) {
  const gesture = telemetry?.gesture || 'No Hand';
  const confidence = telemetry?.confidence || 0;
  const handDetected = telemetry?.hand_detected || false;
  const confPercent = Math.round(confidence * 100);

  const gestureIcon = GESTURE_ICONS[gesture] || '✋';

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI Gesture Recognition</h2>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            handDetected 
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800/80 text-slate-400 border border-slate-700'
          }`}>
            {handDetected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {handDetected ? 'Hand Tracking Active' : 'No Hand Detected'}
          </div>
        </div>

        {/* Gesture Display Banner */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 shadow-inner flex items-center justify-center">
              {gestureIcon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Detected Pose</p>
              <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                {gesture}
                {gesture !== 'No Hand' && <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />}
              </h3>
            </div>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">AI Confidence Score</span>
            <span className={`font-mono ${confPercent >= 70 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {confPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                confPercent >= 80 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' 
                  : confPercent >= 60 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                  : 'bg-slate-700'
              }`}
              style={{ width: `${confPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>FPS: <strong className="text-slate-200">{telemetry?.fps || 0}</strong></span>
        </div>
        <span className="text-slate-500">MediaPipe Hands v0.10</span>
      </div>
    </div>
  );
}
