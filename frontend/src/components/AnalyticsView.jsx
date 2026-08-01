import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart as PieIcon, Activity, Flame, Cpu, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAnalyticsData } from '../services/api';

const COLORS = ['#06b6d4', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#3b82f6'];

export default function AnalyticsView() {
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalyticsData();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const gestureData = analytics?.gesture_breakdown || [
    { name: 'Open Palm', value: 12 },
    { name: 'Fist', value: 18 },
    { name: 'Thumbs Up', value: 8 },
    { name: 'Peace', value: 15 },
    { name: 'Index', value: 24 }
  ];

  const sourceData = analytics?.source_breakdown || [
    { source: 'Gesture', count: 45 },
    { source: 'Voice', count: 12 },
    { source: 'Manual', count: 18 }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">System Usage Analytics</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">Live Telemetry Metrics</span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" /> Total Gestures
          </div>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">
            {analytics?.total_gestures_detected ?? 0}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400" /> Most Used Gesture
          </div>
          <p className="text-xl font-extrabold text-amber-300 truncate font-mono">
            {analytics?.most_frequent_gesture || 'None'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Cpu className="w-4 h-4 text-emerald-400" /> IoT Commands
          </div>
          <p className="text-2xl font-extrabold text-emerald-300 font-mono">
            {analytics?.total_iot_commands ?? 0}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Computer HCI
          </div>
          <p className="text-2xl font-extrabold text-purple-300 font-mono">
            {analytics?.total_computer_commands ?? 0}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-300 mb-3">Gesture Detection Breakdown</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gestureData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <h3 className="text-xs font-semibold text-slate-300 mb-3">Command Trigger Sources</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={60} label>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
