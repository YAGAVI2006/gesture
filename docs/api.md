# API & WebSocket Specification

## REST API Endpoints

### 1. System Telemetry
`GET /api/status`
Returns current system state, detected gesture, confidence score, FPS, IoT device status, and active settings.

### 2. Activity Logs
`GET /api/logs?limit=50`
Retrieves recent activity logs stored in SQLite database.

`DELETE /api/logs`
Clears all activity log records.

### 3. Usage Analytics
`GET /api/analytics`
Returns aggregate statistics: total gestures detected, most frequent gesture, total IoT commands, computer HCI commands, and breakdown by trigger source.

### 4. System Settings
`GET /api/settings`
Retrieves current sensitivity, cooldown duration, camera index, and toggle states.

`POST /api/settings`
Updates system settings.

### 5. System Controls
- `POST /api/control/camera` — `{"action": "start" | "stop"}`
- `POST /api/control/iot` — `{"device": "light" | "fan", "action": "ON" | "OFF"}`
- `POST /api/control/presentation` — `{"action": "start" | "exit" | "next" | "prev"}`
- `POST /api/control/toggles` — `{"feature": "gesture" | "computer" | "iot" | "voice" | "presentation", "enabled": boolean}`

---

## WebSocket API

### Connection Endpoint
`ws://localhost:8000/ws`

### Outbound Event Messages

#### Telemetry Frame (`TELEMETRY`)
```json
{
  "type": "TELEMETRY",
  "gesture": "Fist",
  "confidence": 0.96,
  "hand_detected": true,
  "fps": 29.8,
  "camera_status": "ACTIVE",
  "last_command": "LIGHT_ON",
  "iot_devices": {
    "light": { "is_on": true, "last_updated": "14:20:01" },
    "fan": { "is_on": false, "last_updated": "14:15:00" }
  }
}
```

#### New Log Event (`NEW_LOG`)
```json
{
  "type": "NEW_LOG",
  "log": {
    "id": 42,
    "gesture": "Fist",
    "confidence": 0.96,
    "command": "LIGHT_ON",
    "device": "Smart Light",
    "source": "gesture",
    "timestamp": "2026-08-01T22:40:00.000Z"
  }
}
```
