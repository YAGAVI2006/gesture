# Project Execution & Data Flow

## Step-by-Step System Flow

1. **Webcam Capture Loop**:
   - `GestureEngine` captures BGR frames from OpenCV VideoCapture at ~30 FPS.
   - If camera is unavailable, a synthetic diagnostic video frame is rendered automatically.

2. **Landmark Extraction**:
   - Frame is converted to RGB and passed to `MediaPipe Hands`.
   - Returns 21 normalized 3D hand landmarks `(x, y, z)`.

3. **Gesture Classification**:
   - `GestureClassifier` evaluates landmark relationships:
     - Distance calculations between finger tips (4, 8, 12, 16, 20) and wrist (0).
     - Pinch detection between Index Tip (8) and Thumb Tip (4).
     - Frame window history delta calculation for `Swipe Left` and `Swipe Right`.

4. **Command Dispatch & Cooldown Check**:
   - Checks if gesture confidence >= `gesture_sensitivity` (default 70%).
   - Evaluates command cooldown timer (`command_cooldown = 1.5s`).
   - Route to target controller:
     - Mouse cursor -> `ComputerController.move_cursor()`
     - Click -> `ComputerController.click()`
     - Slide Navigation -> `PresentationController.next_slide()`
     - Virtual Light / Fan -> `IoTManager.execute_command()`

5. **Audit Logging & Real-time Broadcast**:
   - Insert execution record into SQLite DB (`ActivityLog`).
   - Broadcast telemetry frame and log payload over WebSocket connection to React dashboard.
