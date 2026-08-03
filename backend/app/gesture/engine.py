import cv2
import time
import threading
import numpy as np
from app.config import settings
from app.gesture.detector import HandDetector
from app.gesture.classifier import GestureClassifier
from app.computer_control.controller import computer_controller
from app.presentation.controller import presentation_controller
from app.iot.manager import iot_manager
from app.app_control.launcher import app_launcher
from app.voice.listener import voice_listener
from app.services.logger import log_activity

class GestureEngine:
    def __init__(self):
        self.detector = HandDetector()
        self.classifier = GestureClassifier()
        
        self.cap = None
        self.is_running = False
        self.thread = None
        
        self.current_gesture = "No Hand"
        self.current_confidence = 0.0
        self.hand_detected = False
        self.fps = 0.0
        self.camera_status = "STOPPED"
        self.last_command_time = 0.0
        self.last_executed_command = "NONE"
        
        self.latest_frame_bytes = None
        self.lock = threading.Lock()
        self.telemetry_callback = None

    def set_telemetry_callback(self, callback):
        self.telemetry_callback = callback

    def start_camera(self, camera_index=0):
        if self.is_running:
            return True
        
        self.is_running = True
        self.thread = threading.Thread(target=self._process_loop, args=(camera_index,), daemon=True)
        self.thread.start()
        return True

    def stop_camera(self):
        self.is_running = False
        if self.cap and self.cap.isOpened():
            self.cap.release()
        self.camera_status = "STOPPED"
        self.hand_detected = False
        self.current_gesture = "No Hand"

    def _process_loop(self, camera_index):
        try:
            self.cap = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
            if not self.cap.isOpened():
                self.cap = cv2.VideoCapture(camera_index)
        except Exception:
            self.cap = None

        if not self.cap or not self.cap.isOpened():
            self.camera_status = "SIMULATED / CAMERA UNAVAILABLE"
        else:
            self.camera_status = "ACTIVE"

        prev_time = time.time()

        while self.is_running:
            try:
                frame = None
                if self.cap and self.cap.isOpened():
                    ret, raw_frame = self.cap.read()
                    if ret:
                        frame = cv2.flip(raw_frame, 1)

                if frame is None:
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(frame, "SIMULATED CAMERA STREAM", (160, 220),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 215, 255), 2)
                    cv2.putText(frame, "Camera offline or disconnected", (170, 260),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 180, 180), 1)

                processed_frame, landmarks, is_hand = self.detector.process_frame(frame)
                
                curr_time = time.time()
                self.fps = round(1.0 / (curr_time - prev_time + 1e-6), 1)
                prev_time = curr_time

                self.hand_detected = is_hand
                if is_hand and settings.gesture_control_enabled:
                    gesture_name, confidence = self.classifier.classify(landmarks)
                    self.current_gesture = gesture_name
                    self.current_confidence = confidence

                    if confidence >= settings.gesture_sensitivity:
                        self._dispatch_gesture_command(gesture_name, confidence, landmarks)
                else:
                    self.current_gesture = "No Hand" if not is_hand else "Control Disabled"
                    self.current_confidence = 0.0

                # Draw visual overlay
                cv2.rectangle(processed_frame, (10, 10), (340, 90), (20, 24, 33), -1)
                cv2.putText(processed_frame, f"Gesture: {self.current_gesture}", (20, 35),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 170), 2)
                cv2.putText(processed_frame, f"Confidence: {int(self.current_confidence * 100)}%", (20, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1)
                cv2.putText(processed_frame, f"FPS: {self.fps}", (20, 80),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (150, 150, 150), 1)

                ret, buffer = cv2.imencode('.jpg', processed_frame)
                if ret:
                    with self.lock:
                        self.latest_frame_bytes = buffer.tobytes()

                if self.telemetry_callback:
                    self.telemetry_callback(self.get_telemetry())

            except Exception:
                pass

            time.sleep(0.03)

    def _dispatch_gesture_command(self, gesture: str, confidence: float, landmarks):
        now = time.time()
        
        # 1. Cursor Movement (Index Finger)
        if gesture == "Index Finger" and settings.computer_control_enabled:
            if landmarks and len(landmarks) > 8:
                index_tip = landmarks[8]
                computer_controller.move_cursor(index_tip.x, index_tip.y)
            return

        # Cooldown check
        if now - self.last_command_time < settings.command_cooldown:
            return

        executed = False
        cmd_name = ""
        device_affected = ""

        # 2. Pinch -> Open Notepad ('N')
        if gesture == "Pinch":
            res = app_launcher.launch_app("notepad", source="gesture")
            if res.get("status") == "success":
                executed, cmd_name, device_affected = True, "OPEN_NOTEPAD", "Notepad"

        # 3. Fist -> Open Windows Camera App ('C')
        elif gesture == "Fist":
            res = app_launcher.launch_app("camera", source="gesture")
            if res.get("status") == "success":
                executed, cmd_name, device_affected = True, "OPEN_CAMERA", "Camera App"

        # 4. Thumbs Up -> Open Chrome Browser
        elif gesture == "Thumbs Up":
            res = app_launcher.launch_app("browser", source="gesture")
            if res.get("status") == "success":
                executed, cmd_name, device_affected = True, "OPEN_CHROME", "Chrome Browser"

        # 5. Peace -> Open Calculator
        elif gesture == "Peace":
            res = app_launcher.launch_app("calculator", source="gesture")
            if res.get("status") == "success":
                executed, cmd_name, device_affected = True, "OPEN_CALCULATOR", "Calculator"

        # 6. Open Palm -> Open Command Prompt Terminal
        elif gesture == "Open Palm":
            res = app_launcher.launch_app("terminal", source="gesture")
            if res.get("status") == "success":
                executed, cmd_name, device_affected = True, "OPEN_TERMINAL", "Command Prompt"

        # 7. Swipe Right -> Next Slide
        elif gesture == "Swipe Right" and settings.presentation_mode:
            if presentation_controller.next_slide():
                executed, cmd_name, device_affected = True, "SLIDE_NEXT", "Presentation"

        # 8. Swipe Left -> Prev Slide
        elif gesture == "Swipe Left" and settings.presentation_mode:
            if presentation_controller.prev_slide():
                executed, cmd_name, device_affected = True, "SLIDE_PREV", "Presentation"

        if executed:
            self.last_command_time = now
            self.last_executed_command = cmd_name
            log_activity(gesture, confidence, cmd_name, device_affected, source="gesture")

    def get_telemetry(self):
        return {
            "type": "TELEMETRY",
            "gesture": self.current_gesture,
            "confidence": self.current_confidence,
            "hand_detected": self.hand_detected,
            "fps": self.fps,
            "camera_status": self.camera_status,
            "last_command": self.last_executed_command,
            "settings": settings.dict(),
            "iot_devices": iot_manager.get_all_devices_status(),
            "last_app_launched": app_launcher.last_launched_app,
            "voice_status": voice_listener.mic_status,
            "last_voice_command": voice_listener.last_command
        }

    def generate_mjpeg_stream(self):
        while True:
            with self.lock:
                frame_bytes = self.latest_frame_bytes
            if frame_bytes:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.04)

gesture_engine = GestureEngine()
