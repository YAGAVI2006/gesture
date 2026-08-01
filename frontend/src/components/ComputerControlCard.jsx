import React from 'react';
import { MousePointer, Monitor, Presentation, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import { toggleFeature } from '../services/api';

export default function ComputerControlCard({ telemetry }) {
  const settings = telemetry?.settings || {};
  const mouseEnabled = settings.computer_control_enabled ?? true;
  const presentationEnabled = settings.presentation_mode ?? false;
  const gestureEnabled = settings.gesture_control_enabled ?? true;

  const handleToggle = async (feature, currentVal) => {
    try {
      await toggleFeature(feature, !currentVal);
    } catch (err) {
      console.error(`Toggle error for ${feature}:`, err);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Computer HCI & Presentation</h2>
          </div>
          <span className="text-xs font-mono text-purple-400 px-2 py-0.5 bg-purple-950/60 rounded-full border border-purple-500/30">
            PyAutoGUI
          </span>
        </div>

        {/* HCI Mode Toggles */}
        <div className="space-y-3 mb-4">
          {/* Gesture Master Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Gesture Engine</p>
                <p className="text-[11px] text-slate-400">Master AI detection</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('gesture', gestureEnabled)}
              className="text-slate-300 hover:text-white transition"
            >
              {gestureEnabled ? (
                <ToggleRight className="w-7 h-7 text-cyan-400" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mouse Movement */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Mouse Control</p>
                <p className="text-[11px] text-slate-400">Index Finger cursor navigation</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('computer', mouseEnabled)}
              className="text-slate-300 hover:text-white transition"
            >
              {mouseEnabled ? (
                <ToggleRight className="w-7 h-7 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-600" />
              )}
            </button>
          </div>

          {/* Presentation Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Presentation className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Presentation Mode</p>
                <p className="text-[11px] text-slate-400">Swipe Left / Right for slides</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('presentation', presentationEnabled)}
              className="text-slate-300 hover:text-white transition"
            >
              {presentationEnabled ? (
                <ToggleRight className="w-7 h-7 text-amber-400" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Safety Cooldown Footer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400">Command Cooldown:</span>
        <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          {settings.command_cooldown || 1.5}s Safe Delay
        </span>
      </div>
    </div>
  );
}
