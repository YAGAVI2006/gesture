from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseIoTDevice(ABC):
    def __init__(self, device_id: str, name: str, device_type: str):
        self.device_id = device_id
        self.name = name
        self.device_type = device_type
        self.is_on = False
        self.last_updated = None
        self.last_command = "INITIALIZED"
        self.connection_status = "ONLINE"

    @abstractmethod
    def turn_on(self, source: str = "manual") -> Dict[str, Any]:
        pass

    @abstractmethod
    def turn_off(self, source: str = "manual") -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        pass
