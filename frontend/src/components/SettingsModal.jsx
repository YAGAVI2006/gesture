import React, { useState, useEffect } from 'react';
import { X, Sliders, Save, Check } from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from '../services/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    gesture_sensitivity: 0.70,
    command_cooldown: 1.5,
    mouse_smoothing: 0.4,
    camera_index: 0,
    iot_mode: 'virtual',
    mqtt_broker: 'broker.hivemq.com',
    browser_path: 'chrome'
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getSystemSettings()
        .then((data) => setFormData(data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSystemSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">System Settings & Calibration</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Gesture Sensitivity */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Gesture Confidence Threshold</span>
              <span className="font-mono text-cyan-400">{Math.round(formData.gesture_sensitivity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={formData.gesture_sensitivity}
              onChange={(e) => handleChange('gesture_sensitivity', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Cooldown Duration */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Command Safety Cooldown</span>
              <span className="font-mono text-amber-400">{formData.command_cooldown} seconds</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={formData.command_cooldown}
              onChange={(e) => handleChange('command_cooldown', parseFloat(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Mouse Smoothing */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Mouse Smoothing Factor</span>
              <span className="font-mono text-purple-400">{formData.mouse_smoothing}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={formData.mouse_smoothing}
              onChange={(e) => handleChange('mouse_smoothing', parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Camera Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Camera Device Index</label>
              <select
                value={formData.camera_index}
                onChange={(e) => handleChange('camera_index', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
              >
                <option value={0}>Camera 0 (Default Webcam)</option>
                <option value={1}>Camera 1 (External USB)</option>
                <option value={2}>Camera 2 (Secondary)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">IoT Operation Mode</label>
              <select
                value={formData.iot_mode}
                onChange={(e) => handleChange('iot_mode', e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
              >
                <option value="virtual">Virtual IoT Simulation Mode</option>
                <option value="mqtt">MQTT ESP32 Hardware Mode</option>
              </select>
            </div>
          </div>

          {/* Application Browser Path */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Application Launch Target</label>
            <input
              type="text"
              value={formData.browser_path}
              onChange={(e) => handleChange('browser_path', e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono"
              placeholder="chrome / edge / custom path"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {savedSuccess ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
