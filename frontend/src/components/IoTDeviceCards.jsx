import React, { useState } from 'react';
import { Lightbulb, Fan, Power, Cpu, RefreshCw } from 'lucide-react';
import { controlIoTDevice } from '../services/api';

export default function IoTDeviceCards({ telemetry }) {
  const [loadingDevice, setLoadingDevice] = useState(null);
  const iotData = telemetry?.iot_devices || {};
  const light = iotData.light || { is_on: false, last_command: 'INIT', last_updated: '--:--:--' };
  const fan = iotData.fan || { is_on: false, last_command: 'INIT', last_updated: '--:--:--' };

  const handleToggleDevice = async (device, currentStatus) => {
    setLoadingDevice(device);
    try {
      const action = currentStatus ? 'OFF' : 'ON';
      await controlIoTDevice(device, action);
    } catch (err) {
      console.error(`IoT control error for ${device}:`, err);
    } finally {
      setLoadingDevice(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* 1. Smart Light Device Card */}
      <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
        light.is_on ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className={`w-5 h-5 transition-all duration-300 ${light.is_on ? 'text-amber-400 light-glow-on' : 'text-slate-500'}`} />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Smart Light</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              light.is_on ? 'bg-amber-950 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              {light.is_on ? 'POWER ON' : 'OFFLINE'}
            </span>
          </div>

          {/* Bulb Visualizer Container */}
          <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition duration-300 ${
                light.is_on ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800/60 text-slate-600'
              }`}>
                <Lightbulb className={`w-7 h-7 ${light.is_on ? 'light-glow-on' : ''}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Virtual Output</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  State: <strong className={light.is_on ? 'text-amber-400' : 'text-slate-500'}>{light.is_on ? 'ON (100%)' : 'OFF (0%)'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleDevice('light', light.is_on)}
              disabled={loadingDevice === 'light'}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                light.is_on
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
            >
              {loadingDevice === 'light' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Cmd: <code className="text-slate-300">{light.last_command}</code></span>
          <span>Updated: <code className="text-slate-400">{light.last_updated}</code></span>
        </div>
      </div>

      {/* 2. Smart Fan Device Card */}
      <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
        fan.is_on ? 'border-cyan-500/40 bg-cyan-950/10' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Fan className={`w-5 h-5 transition-all duration-300 ${fan.is_on ? 'text-cyan-400 animate-spin-fan' : 'text-slate-500'}`} />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Smart Fan</h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              fan.is_on ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              {fan.is_on ? 'ROTATING' : 'OFFLINE'}
            </span>
          </div>

          {/* Fan Visualizer Container */}
          <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition duration-300 ${
                fan.is_on ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800/60 text-slate-600'
              }`}>
                <Fan className={`w-7 h-7 ${fan.is_on ? 'animate-spin-fan' : ''}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Virtual Output</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Speed: <strong className={fan.is_on ? 'text-cyan-400' : 'text-slate-500'}>{fan.is_on ? 'Level 3' : 'STOPPED'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleDevice('fan', fan.is_on)}
              disabled={loadingDevice === 'fan'}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                fan.is_on
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
              }`}
            >
              {loadingDevice === 'fan' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Cmd: <code className="text-slate-300">{fan.last_command}</code></span>
          <span>Updated: <code className="text-slate-400">{fan.last_updated}</code></span>
        </div>
      </div>
    </div>
  );
}
