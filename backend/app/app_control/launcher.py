import os
import sys
import subprocess
import webbrowser
from typing import Dict, Any

class AppLauncher:
    def __init__(self):
        self.last_launched_app = "None"
        self.last_launch_status = "READY"

    def launch_app(self, app_key: str, source: str = "manual") -> Dict[str, Any]:
        app_key_lower = app_key.lower().strip()
        executed = False
        app_display_name = ""

        try:
            if app_key_lower in ["notepad", "note", "n"]:
                if sys.platform == "win32":
                    subprocess.Popen(["notepad.exe"])
                else:
                    subprocess.Popen(["gedit"])
                app_display_name = "Notepad"
                executed = True

            elif app_key_lower in ["camera", "cam", "c"]:
                if sys.platform == "win32":
                    subprocess.Popen(["start", "microsoft.windows.camera:"], shell=True)
                else:
                    subprocess.Popen(["cheese"])
                app_display_name = "Camera App"
                executed = True

            elif app_key_lower in ["calculator", "calc"]:
                if sys.platform == "win32":
                    subprocess.Popen(["calc.exe"])
                else:
                    subprocess.Popen(["gnome-calculator"])
                app_display_name = "Calculator"
                executed = True

            elif app_key_lower in ["browser", "chrome"]:
                webbrowser.open("https://www.google.com")
                app_display_name = "Chrome Browser"
                executed = True

            elif app_key_lower in ["terminal", "cmd"]:
                if sys.platform == "win32":
                    subprocess.Popen(["cmd.exe", "/c", "start", "cmd"])
                else:
                    subprocess.Popen(["x-terminal-emulator"])
                app_display_name = "Command Prompt"
                executed = True

            else:
                return {
                    "status": "error",
                    "message": f"Unsupported application: '{app_key}'"
                }

            if executed:
                self.last_launched_app = app_display_name
                self.last_launch_status = "LAUNCHED"
                return {
                    "status": "success",
                    "app_name": app_display_name,
                    "command": f"OPEN_{app_display_name.upper().replace(' ', '_')}",
                    "source": source
                }

        except Exception as e:
            self.last_launch_status = f"ERROR: {str(e)}"
            return {
                "status": "error",
                "message": f"Failed to launch {app_key}: {str(e)}"
            }

app_launcher = AppLauncher()
