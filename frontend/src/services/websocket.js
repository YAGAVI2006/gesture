class SystemWebSocket {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.logListeners = new Set();
    this.statusListeners = new Set();
    this.reconnectTimer = null;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.notifyStatus(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TELEMETRY') {
            this.listeners.forEach((cb) => cb(data));
          } else if (data.type === 'NEW_LOG') {
            this.logListeners.forEach((cb) => cb(data.log));
          }
        } catch (err) {
          console.error('Error parsing WS frame:', err);
        }
      };

      this.ws.onclose = () => {
        console.warn('WebSocket Disconnected. Reconnecting in 2s...');
        this.notifyStatus(false);
        this.reconnectTimer = setTimeout(() => this.connect(), 2000);
      };

      this.ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        this.notifyStatus(false);
      };
    } catch (e) {
      console.error('WebSocket Connection Failed:', e);
      this.notifyStatus(false);
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    }
  }

  subscribeTelemetry(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  subscribeLogs(callback) {
    this.logListeners.add(callback);
    return () => this.logListeners.delete(callback);
  }

  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  notifyStatus(isConnected) {
    this.statusListeners.forEach((cb) => cb(isConnected));
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) this.ws.close();
  }
}

export const sysWS = new SystemWebSocket();
