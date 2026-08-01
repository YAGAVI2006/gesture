import React from 'react';
import { Mic, MicOff, Volume2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toggleFeature } from '../services/api';

export default function VoiceCard({ telemetry }) {
  const voiceEnabled = telemetry?.settings?.voice_control_enabled ?? false;
  const voiceStatus = telemetry?.voice_status || 'READY';
  const lastVoiceCmd = telemetry?.last_voice_command || 'None';

  const handleToggleVoice = async () => {
    try {
      await toggleFeature('voice', !voiceEnabled);
    } catch (err) {
      console.error('Voice toggle error:', err);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mic className={`w-5 h-5 ${voiceEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Voice Control Module</h2>
          </div>

          <button
            onClick={handleToggleVoice}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            {voiceEnabled ? (
              <ToggleRight className="w-7 h-7 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-600" />
            )}
          </button>
        </div>

        {/* Speech Recognition Status Box */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              voiceEnabled
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-600 border-slate-700'
            }`}>
              {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Speech Engine</p>
              <p className="text-[11px] font-mono text-slate-400">{voiceStatus}</p>
            </div>
          </div>
        </div>

        {/* Last Command Display */}
        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Last Recognized Phrase:
          </span>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 min-h-[42px] flex items-center">
            "{lastVoiceCmd}"
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
        Supports: "turn on light", "turn off light", "turn on fan", "presentation mode"
      </div>
    </div>
  );
}
