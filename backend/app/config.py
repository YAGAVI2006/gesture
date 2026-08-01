import os
from pydantic import BaseModel

class SystemSettings(BaseModel):
    gesture_control_enabled: bool = True
    computer_control_enabled: bool = True
    iot_control_enabled: bool = True
    voice_control_enabled: bool = False
    presentation_mode: bool = False
    
    gesture_sensitivity: float = 0.65  # min confidence threshold
    command_cooldown: float = 1.2      # seconds between triggered commands
    mouse_smoothing: float = 0.35     # smoothing factor for cursor movement
    
    camera_index: int = 0
    camera_enabled: bool = True
    
    iot_mode: str = "virtual"           # "virtual" or "mqtt"
    mqtt_broker: str = "broker.hivemq.com"
    mqtt_port: int = 1883
    
    browser_path: str = os.getenv("BROWSER_PATH", "chrome")

settings = SystemSettings()
