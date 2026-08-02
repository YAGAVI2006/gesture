from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class CameraControlRequest(BaseModel):
    action: str = Field(..., description="Action to perform: 'start' or 'stop'")

class IoTControlRequest(BaseModel):
    device: str = Field(..., description="Target device: 'light' or 'fan'")
    action: str = Field(..., description="Device action: 'ON' or 'OFF'")

class PresentationControlRequest(BaseModel):
    action: str = Field(..., description="Slide action: 'start', 'exit', 'next', 'prev'")

class ToggleFeatureRequest(BaseModel):
    feature: str = Field(..., description="Feature name: 'gesture', 'computer', 'iot', 'voice', 'presentation'")
    enabled: bool = Field(True, description="Enable or disable boolean flag")

class ActivityLogResponse(BaseModel):
    id: int
    gesture: Optional[str] = None
    confidence: Optional[float] = None
    command: str
    device: Optional[str] = None
    source: str
    timestamp: Optional[str] = None

class SystemAnalyticsResponse(BaseModel):
    total_gestures_detected: int
    most_frequent_gesture: str
    total_iot_commands: int
    total_computer_commands: int
    gesture_breakdown: List[Dict[str, Any]]
    source_breakdown: List[Dict[str, Any]]
