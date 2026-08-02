import { useEffect } from 'react';
import { controlIoTDevice, controlPresentation } from '../services/api';

export function useKeyboardShortcuts(telemetry) {
  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ignore if user is typing in input or select field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'l') {
        const lightStatus = telemetry?.iot_devices?.light?.is_on;
        await controlIoTDevice('light', lightStatus ? 'OFF' : 'ON');
      } else if (key === 'f') {
        const fanStatus = telemetry?.iot_devices?.fan?.is_on;
        await controlIoTDevice('fan', fanStatus ? 'OFF' : 'ON');
      } else if (key === 'p') {
        const presMode = telemetry?.settings?.presentation_mode;
        await controlPresentation(presMode ? 'exit' : 'start');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [telemetry]);
}
