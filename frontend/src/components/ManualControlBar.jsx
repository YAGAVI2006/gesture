import React, { useState } from 'react';
import { Lightbulb, Fan, Camera, Presentation, Zap, RefreshCw } from 'lucide-react';
import { controlIoTDevice, controlCamera, controlPresentation, toggleFeature } from '../services/api';

export default function ManualControlBar({ telemetry }) {
  const [loading, setLoading] = useState(null);

  const lightOn = telemetry?.iot_devices?.light?.is_on;
  const fanOn = telemetry?.iot_devices?.fan?.is_on;
  const cameraActive = telemetry?.camera_status === 'ACTIVE' || telemetry?.camera_status?.includes('SIMULATED');
  const presentationMode = telemetry?.settings?.presentation_mode;

  const handleIoT = async (device, action) => {
    setLoading(`${device}_${action}`);
    try {
      await controlIoTDevice(device, action);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleCam = async (action) => {
    setLoading(`cam_${action}`);
    try {
      await controlCamera(action);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handlePres = async (action) => {
    setLoading(`pres_${action}`);
    try {
      await controlPresentation(action);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-amber-400" />
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Manual Override Control Bar</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Light Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleIoT('light', 'ON')}
            disabled={loading === 'light_ON'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              lightOn ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" /> Light ON
          </button>
          <button
            onClick={() => handleIoT('light', 'OFF')}
            disabled={loading === 'light_OFF'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !lightOn ? 'bg-slate-800 text-slate-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Light OFF
          </button>
        </div>

        {/* Fan Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleIoT('fan', 'ON')}
            disabled={loading === 'fan_ON'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              fanOn ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Fan className="w-3.5 h-3.5" /> Fan ON
          </button>
          <button
            onClick={() => handleIoT('fan', 'OFF')}
            disabled={loading === 'fan_OFF'}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !fanOn ? 'bg-slate-800 text-slate-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fan OFF
          </button>
        </div>

        {/* Camera Controls */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleCam(cameraActive ? 'stop' : 'start')}
            disabled={loading?.startsWith('cam_')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              cameraActive ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> {cameraActive ? 'Stop Cam' : 'Start Cam'}
          </button>
        </div>

        {/* Presentation Slide Nav */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handlePres('prev')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
          >
            ◄ Prev
          </button>
          <button
            onClick={() => handlePres(presentationMode ? 'exit' : 'start')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              presentationMode ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" /> {presentationMode ? 'Exit Pres' : 'Start Pres'}
          </button>
          <button
            onClick={() => handlePres('next')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white"
          >
            Next ►
          </button>
        </div>
      </div>
    </div>
  );
}
