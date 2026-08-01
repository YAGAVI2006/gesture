import time
import pyautogui
from app.config import settings

class PresentationController:
    def __init__(self):
        self.last_action_time = 0.0

    def next_slide(self) -> bool:
        if not settings.presentation_mode:
            return False

        now = time.time()
        if now - self.last_action_time < settings.command_cooldown:
            return False

        try:
            pyautogui.press('right')
            self.last_action_time = now
            return True
        except Exception:
            return False

    def prev_slide(self) -> bool:
        if not settings.presentation_mode:
            return False

        now = time.time()
        if now - self.last_action_time < settings.command_cooldown:
            return False

        try:
            pyautogui.press('left')
            self.last_action_time = now
            return True
        except Exception:
            return False

    def start_presentation(self) -> bool:
        try:
            pyautogui.press('f5')
            settings.presentation_mode = True
            return True
        except Exception:
            return False

    def exit_presentation(self) -> bool:
        try:
            pyautogui.press('esc')
            settings.presentation_mode = False
            return True
        except Exception:
            return False

presentation_controller = PresentationController()
