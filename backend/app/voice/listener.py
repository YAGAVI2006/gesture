import threading
import time

try:
    import speech_recognition as sr
    SPEECH_REC_AVAILABLE = True
except ImportError:
    SPEECH_REC_AVAILABLE = False

from app.config import settings
from app.iot.manager import iot_manager
from app.presentation.controller import presentation_controller

class VoiceListener:
    def __init__(self):
        self.is_running = False
        self.last_command = "None"
        self.mic_status = "DISCONNECTED" if not SPEECH_REC_AVAILABLE else "READY"
        self.thread = None
        self.event_callback = None

    def set_callback(self, callback):
        self.event_callback = callback

    def start(self):
        if not SPEECH_REC_AVAILABLE:
            self.mic_status = "UNAVAILABLE (Library Missing)"
            return False

        if self.is_running:
            return True

        self.is_running = True
        self.thread = threading.Thread(target=self._listen_loop, daemon=True)
        self.thread.start()
        return True

    def stop(self):
        self.is_running = False

    def _listen_loop(self):
        recognizer = sr.Recognizer()
        
        try:
            mic = sr.Microphone()
            self.mic_status = "LISTENING"
        except Exception:
            self.mic_status = "NO MICROPHONE DETECTED"
            self.is_running = False
            return

        with mic as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)

        while self.is_running and settings.voice_control_enabled:
            try:
                with mic as source:
                    audio = recognizer.listen(source, timeout=3, phrase_time_limit=4)
                
                text = recognizer.recognize_google(audio).lower()
                self.last_command = text
                self._process_command(text)
            except sr.WaitTimeoutError:
                pass
            except sr.UnknownValueError:
                pass
            except Exception as e:
                time.sleep(1)

    def _process_command(self, text: str):
        command_executed = None
        device_affected = None

        if "turn on light" in text or "light on" in text:
            result = iot_manager.execute_command("light", "ON", source="voice")
            command_executed = "LIGHT_ON"
            device_affected = "Smart Light"

        elif "turn off light" in text or "light off" in text:
            result = iot_manager.execute_command("light", "OFF", source="voice")
            command_executed = "LIGHT_OFF"
            device_affected = "Smart Light"

        elif "turn on fan" in text or "fan on" in text:
            result = iot_manager.execute_command("fan", "ON", source="voice")
            command_executed = "FAN_ON"
            device_affected = "Smart Fan"

        elif "turn off fan" in text or "fan off" in text:
            result = iot_manager.execute_command("fan", "OFF", source="voice")
            command_executed = "FAN_OFF"
            device_affected = "Smart Fan"

        elif "presentation mode" in text or "start presentation" in text:
            presentation_controller.start_presentation()
            command_executed = "PRESENTATION_START"
            device_affected = "Presentation"

        elif "exit presentation" in text or "stop presentation" in text:
            presentation_controller.exit_presentation()
            command_executed = "PRESENTATION_EXIT"
            device_affected = "Presentation"

        if command_executed and self.event_callback:
            self.event_callback("Voice Command", 1.0, command_executed, device_affected, "voice")

voice_listener = VoiceListener()
