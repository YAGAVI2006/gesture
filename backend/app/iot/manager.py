from typing import Dict, Any
from app.iot.virtual_device import VirtualSmartLight, VirtualSmartFan

class IoTManager:
    def __init__(self):
        self.light = VirtualSmartLight()
        self.fan = VirtualSmartFan()

    def get_all_devices_status(self) -> Dict[str, Any]:
        return {
            "light": self.light.get_status(),
            "fan": self.fan.get_status()
        }

    def execute_command(self, device_name: str, action: str, source: str = "manual") -> Dict[str, Any]:
        device_name_lower = device_name.lower()
        action_upper = action.upper()

        target_device = None
        if "light" in device_name_lower:
            target_device = self.light
        elif "fan" in device_name_lower:
            target_device = self.fan

        if not target_device:
            return {"status": "error", "message": f"Unknown device: {device_name}"}

        if action_upper in ["ON", "TURN_ON"]:
            result = target_device.turn_on(source=source)
        elif action_upper in ["OFF", "TURN_OFF"]:
            result = target_device.turn_off(source=source)
        else:
            return {"status": "error", "message": f"Invalid action: {action}"}

        return {
            "status": "success",
            "device": target_device.name,
            "action": action_upper,
            "device_state": result,
            "all_devices": self.get_all_devices_status()
        }

iot_manager = IoTManager()
