import React, { useState } from 'react';
import { Camera, RefreshCw, Video, VideoOff } from 'lucide-react';
import { controlCamera } from '../services/api';

export default function CameraFeed({ telemetry }) {
  const [loading, setLoading] = useState(false);
  const cameraActive = telemetry?.camera_status === 'ACTIVE' || telemetry?.camera_status?.includes('SIMULATED');

  const handleToggleCamera = async () => {
    setLoading(true);
    try {
      const action = cameraActive ? 'stop' : 'start';
      await controlCamera(action);
    } catch (err) {
      console.error('Camera toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full border border-slate-800/80 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Live Vision Stream</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
            telemetry?.fps > 20 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
          }`}>
            {telemetry?.fps || 0} FPS
          </span>

          <button
            onClick={handleToggleCamera}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition duration-200 ${
              cameraActive
                ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : cameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            {cameraActive ? 'Stop Stream' : 'Start Camera'}
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
        {cameraActive ? (
          <img
            src="/api/video_feed"
            alt="AI Gesture Feed"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <VideoOff className="w-12 h-12 mb-2 text-slate-600 animate-pulse" />
            <p className="text-sm font-medium">Camera Feed Disconnected</p>
            <p className="text-xs text-slate-600 mt-1">Click 'Start Camera' to initiate MediaPipe hand detection</p>
          </div>
        )}

        {/* Status Overlay Badge */}
        {cameraActive && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-cyan-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {telemetry?.camera_status || 'LIVE'}
          </div>
        )}
      </div>
    </div>
  );
}
