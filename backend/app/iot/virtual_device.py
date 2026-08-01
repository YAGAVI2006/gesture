from datetime import datetime
from typing import Dict, Any
from app.iot.base import BaseIoTDevice

class VirtualSmartLight(BaseIoTDevice):
    def __init__(self, device_id="light_01", name="Smart Light"):
        super().__init__(device_id=device_id, name=name, device_type="Light")
        self.brightness = 100

    def turn_on(self, source: str = "manual") -> Dict[str, Any]:
        self.is_on = True
        self.last_command = "LIGHT_ON"
        self.last_updated = datetime.now().strftime("%H:%M:%S")
        return self.get_status()

    def turn_off(self, source: str = "manual") -> Dict[str, Any]:
        self.is_on = False
        self.last_command = "LIGHT_OFF"
        self.last_updated = datetime.now().strftime("%H:%M:%S")
        return self.get_status()

    def get_status(self) -> Dict[str, Any]:
        return {
            "device_id": self.device_id,
            "name": self.name,
            "device_type": self.device_type,
            "is_on": self.is_on,
            "brightness": self.brightness if self.is_on else 0,
            "last_updated": self.last_updated or datetime.now().strftime("%H:%M:%S"),
            "last_command": self.last_command,
            "connection_status": self.connection_status,
            "mode": "Virtual"
        }


class VirtualSmartFan(BaseIoTDevice):
    def __init__(self, device_id="fan_01", name="Smart Fan"):
        super().__init__(device_id=device_id, name=name, device_type="Fan")
        self.speed = 3  # Level 1 to 5

    def turn_on(self, source: str = "manual") -> Dict[str, Any]:
        self.is_on = True
        self.last_command = "FAN_ON"
        self.last_updated = datetime.now().strftime("%H:%M:%S")
        return self.get_status()

    def turn_off(self, source: str = "manual") -> Dict[str, Any]:
        self.is_on = False
        self.last_command = "FAN_OFF"
        self.last_updated = datetime.now().strftime("%H:%M:%S")
        return self.get_status()

    def get_status(self) -> Dict[str, Any]:
        return {
            "device_id": self.device_id,
            "name": self.name,
            "device_type": self.device_type,
            "is_on": self.is_on,
            "speed": self.speed if self.is_on else 0,
            "last_updated": self.last_updated or datetime.now().strftime("%H:%M:%S"),
            "last_command": self.last_command,
            "connection_status": self.connection_status,
            "mode": "Virtual"
        }
