import math

class GestureClassifier:
    def __init__(self):
        self.swipe_history = []
        self.swipe_max_history = 8
        self.swipe_threshold = 0.22  # normalized screen movement delta

    def calculate_distance(self, p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

    def is_finger_extended(self, landmarks, tip_id, pip_id, mcp_id, wrist_id=0):
        tip_dist = self.calculate_distance(landmarks[tip_id], landmarks[wrist_id])
        pip_dist = self.calculate_distance(landmarks[pip_id], landmarks[wrist_id])
        mcp_dist = self.calculate_distance(landmarks[mcp_id], landmarks[wrist_id])
        return tip_dist > pip_dist and tip_dist > mcp_dist

    def classify(self, landmarks):
        if not landmarks:
            return "No Hand", 0.0

        wrist = landmarks[0]
        
        # Check finger extensions
        thumb_ext = self.is_finger_extended(landmarks, 4, 2, 1)
        index_ext = self.is_finger_extended(landmarks, 8, 6, 5)
        middle_ext = self.is_finger_extended(landmarks, 12, 10, 9)
        ring_ext = self.is_finger_extended(landmarks, 16, 14, 13)
        pinky_ext = self.is_finger_extended(landmarks, 20, 18, 17)

        # Distance between index tip and thumb tip for Pinch detection
        index_thumb_dist = self.calculate_distance(landmarks[8], landmarks[4])
        
        # Track x-position history for dynamic Swipe Detection
        current_x = landmarks[8].x
        self.swipe_history.append(current_x)
        if len(self.swipe_history) > self.swipe_max_history:
            self.swipe_history.pop(0)

        # Dynamic Swipe Detection
        if len(self.swipe_history) >= 5:
            delta_x = self.swipe_history[-1] - self.swipe_history[0]
            if delta_x > self.swipe_threshold:
                self.swipe_history.clear()
                return "Swipe Right", 0.92
            elif delta_x < -self.swipe_threshold:
                self.swipe_history.clear()
                return "Swipe Left", 0.92

        # 1. Pinch Gesture: Index & Thumb tips close together
        if index_thumb_dist < 0.05 and not (middle_ext and ring_ext and pinky_ext):
            confidence = max(0.70, 1.0 - (index_thumb_dist / 0.05) * 0.3)
            return "Pinch", round(confidence, 2)

        # 2. Open Palm: All 5 fingers extended
        if thumb_ext and index_ext and middle_ext and ring_ext and pinky_ext:
            return "Open Palm", 0.95

        # 3. Fist: All fingers closed
        if not thumb_ext and not index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "Fist", 0.96

        # 4. Thumbs Up: Thumb extended, others folded
        if thumb_ext and not index_ext and not middle_ext and not ring_ext and not pinky_ext:
            if landmarks[4].y < landmarks[3].y < wrist.y:
                return "Thumbs Up", 0.94

        # 5. Peace / Two Fingers: Index & Middle extended, Ring & Pinky folded
        if index_ext and middle_ext and not ring_ext and not pinky_ext:
            return "Peace", 0.91

        # 6. Index Finger Pointing: Only Index finger extended
        if index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "Index Finger", 0.90

        # Fallback / Unknown hand pose
        return "Hand Detected", 0.75
