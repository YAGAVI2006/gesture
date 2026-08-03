import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CameraFeed from './components/CameraFeed';
import GestureCard from './components/GestureCard';
import ComputerControlCard from './components/ComputerControlCard';
import LaptopAppCards from './components/LaptopAppCards';
import IoTDeviceCards from './components/IoTDeviceCards';
import VoiceCard from './components/VoiceCard';
import ActivityLogs from './components/ActivityLogs';
import AnalyticsView from './components/AnalyticsView';
import ManualControlBar from './components/ManualControlBar';
import SettingsModal from './components/SettingsModal';

import { sysWS } from './services/websocket';
import { getActivityLogs } from './services/api';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useKeyboardShortcuts(telemetry);

  const fetchLogs = async () => {
    try {
      const data = await getActivityLogs(50);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    sysWS.connect();

    const unsubTelemetry = sysWS.subscribeTelemetry((data) => {
      setTelemetry(data);
    });

    const unsubLogs = sysWS.subscribeLogs((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    });

    const unsubStatus = sysWS.subscribeStatus((status) => {
      setIsWsConnected(status);
    });

    return () => {
      unsubTelemetry();
      unsubLogs();
      unsubStatus();
      sysWS.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen pb-12">
      <Header
        isWsConnected={isWsConnected}
        telemetry={telemetry}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* Row 1: Vision Stream & AI Gesture Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CameraFeed telemetry={telemetry} />
          </div>
          <div className="lg:col-span-1">
            <GestureCard telemetry={telemetry} />
          </div>
        </div>

        {/* Laptop Applications Section */}
        <LaptopAppCards telemetry={telemetry} />

        {/* Row 2: HCI Controls & Virtual IoT Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ComputerControlCard telemetry={telemetry} />
          </div>
          <div className="lg:col-span-2">
            <IoTDeviceCards telemetry={telemetry} />
          </div>
        </div>

        <ManualControlBar telemetry={telemetry} />

        {/* Row 3: Voice Control & Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VoiceCard telemetry={telemetry} />
          </div>
          <div className="lg:col-span-2">
            <ActivityLogs logs={logs} onRefreshLogs={fetchLogs} />
          </div>
        </div>

        <AnalyticsView />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
