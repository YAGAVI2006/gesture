import time
import pyautogui
from app.config import settings

# PyAutoGUI safety configuration
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.01

class ComputerController:
    def __init__(self):
        self.screen_w, self.screen_h = pyautogui.size()
        self.prev_mouse_x, self.prev_mouse_y = self.screen_w // 2, self.screen_h // 2
        self.last_click_time = 0.0
        self.last_scroll_time = 0.0

    def move_cursor(self, landmark_x: float, landmark_y: float):
        if not settings.computer_control_enabled:
            return

        margin = 0.1
        clamped_x = max(margin, min(1.0 - margin, landmark_x))
        clamped_y = max(margin, min(1.0 - margin, landmark_y))
        
        target_x = int((clamped_x - margin) / (1.0 - 2 * margin) * self.screen_w)
        target_y = int((clamped_y - margin) / (1.0 - 2 * margin) * self.screen_h)

        curr_x = self.prev_mouse_x + (target_x - self.prev_mouse_x) * settings.mouse_smoothing
        curr_y = self.prev_mouse_y + (target_y - self.prev_mouse_y) * settings.mouse_smoothing

        try:
            pyautogui.moveTo(int(curr_x), int(curr_y))
            self.prev_mouse_x, self.prev_mouse_y = curr_x, curr_y
        except Exception:
            pass

    def click(self) -> bool:
        if not settings.computer_control_enabled:
            return False
        
        now = time.time()
        if now - self.last_click_time < settings.command_cooldown:
            return False

        try:
            pyautogui.click()
            self.last_click_time = now
            return True
        except Exception:
            return False

    def double_click(self) -> bool:
        if not settings.computer_control_enabled:
            return False

        now = time.time()
        if now - self.last_click_time < settings.command_cooldown:
            return False

        try:
            pyautogui.doubleClick()
            self.last_click_time = now
            return True
        except Exception:
            return False

    def scroll(self, amount: int = 300) -> bool:
        if not settings.computer_control_enabled:
            return False

        now = time.time()
        if now - self.last_scroll_time < settings.command_cooldown:
            return False

        try:
            pyautogui.scroll(amount)
            self.last_scroll_time = now
            return True
        except Exception:
            return False

computer_controller = ComputerController()
