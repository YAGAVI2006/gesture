import React, { useState } from 'react';
import { ListFilter, Trash2, Download, History, Search, Hand, Mic, UserCheck } from 'lucide-react';
import { clearActivityLogs } from '../services/api';

export default function ActivityLogs({ logs = [], onRefreshLogs }) {
  const [filterSource, setFilterSource] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSource = filterSource === 'ALL' || log.source?.toUpperCase() === filterSource;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      log.gesture?.toLowerCase().includes(searchLower) ||
      log.command?.toLowerCase().includes(searchLower) ||
      log.device?.toLowerCase().includes(searchLower);
    return matchesSource && matchesSearch;
  });

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all system activity logs?')) {
      try {
        await clearActivityLogs();
        if (onRefreshLogs) onRefreshLogs();
      } catch (err) {
        console.error('Clear logs error:', err);
      }
    }
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ['ID', 'Timestamp', 'Gesture', 'Confidence', 'Command', 'Device', 'Source'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      l.gesture || 'N/A',
      l.confidence || 'N/A',
      l.command,
      l.device || 'N/A',
      l.source
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gesture_system_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSourceBadge = (source) => {
    switch (source?.toLowerCase()) {
      case 'gesture':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30"><Hand className="w-3 h-3" /> Gesture</span>;
      case 'voice':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30"><Mic className="w-3 h-3" /> Voice</span>;
      case 'manual':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-500/30"><UserCheck className="w-3 h-3" /> Manual</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">System</span>;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Activity Execution Logs</h2>
          <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'GESTURE', 'VOICE', 'MANUAL'].map((src) => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  filterSource === src ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs flex items-center gap-1"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900 text-slate-400 font-mono sticky top-0 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Gesture</th>
              <th className="py-2.5 px-3">Command</th>
              <th className="py-2.5 px-3">Device / Action</th>
              <th className="py-2.5 px-3">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2 px-3 text-slate-400 font-sans">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--'}</td>
                  <td className="py-2 px-3 font-semibold text-cyan-300">{log.gesture || 'N/A'}</td>
                  <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">{log.command}</span></td>
                  <td className="py-2 px-3 text-slate-300">{log.device || 'System'}</td>
                  <td className="py-2 px-3">{getSourceBadge(log.source)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                  No matching activity events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
