import math

class GestureClassifier:
    def __init__(self):
        self.swipe_history = []
        self.swipe_max_history = 8
        self.swipe_threshold = 0.20  # normalized screen movement delta

    def calculate_distance(self, p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

    def is_finger_extended(self, landmarks, tip_id, pip_id, mcp_id, wrist_id=0):
        tip_dist = self.calculate_distance(landmarks[tip_id], landmarks[wrist_id])
        pip_dist = self.calculate_distance(landmarks[pip_id], landmarks[wrist_id])
        mcp_dist = self.calculate_distance(landmarks[mcp_id], landmarks[wrist_id])
        return tip_dist > pip_dist * 0.95 and tip_dist > mcp_dist

    def classify(self, landmarks):
        if not landmarks or len(landmarks) < 21:
            return "No Hand", 0.0

        wrist = landmarks[0]
        
        # Check finger extensions
        thumb_ext = self.is_finger_extended(landmarks, 4, 2, 1)
        index_ext = self.is_finger_extended(landmarks, 8, 6, 5)
        middle_ext = self.is_finger_extended(landmarks, 12, 10, 9)
        ring_ext = self.is_finger_extended(landmarks, 16, 14, 13)
        pinky_ext = self.is_finger_extended(landmarks, 20, 18, 17)

        # Distance between index tip (8) and thumb tip (4)
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

        # 1. Pinch Gesture: Index Tip & Thumb Tip close together (< 0.095 normalized distance)
        if index_thumb_dist < 0.095 and not (middle_ext and ring_ext and pinky_ext):
            confidence = max(0.75, 1.0 - (index_thumb_dist / 0.095) * 0.25)
            return "Pinch", round(confidence, 2)

        # 2. Open Palm: 4 or 5 fingers extended
        extended_count = sum([index_ext, middle_ext, ring_ext, pinky_ext])
        if extended_count >= 4:
            return "Open Palm", 0.95

        # 3. Fist: All 4 main fingers folded
        if not index_ext and not middle_ext and not ring_ext and not pinky_ext:
            if not thumb_ext or landmarks[4].y > landmarks[3].y:
                return "Fist", 0.96

        # 4. Thumbs Up: Thumb pointing upward, main 4 fingers folded
        if thumb_ext and not index_ext and not middle_ext and not ring_ext:
            if landmarks[4].y < landmarks[3].y < wrist.y:
                return "Thumbs Up", 0.94

        # 5. Peace / Two Fingers: Index & Middle extended, Ring & Pinky folded
        if index_ext and middle_ext and not ring_ext and not pinky_ext:
            return "Peace", 0.92

        # 6. Index Finger Pointing: Only Index extended
        if index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "Index Finger", 0.90

        # Default Hand Detected pose
        return "Hand Detected", 0.75
