import cv2
import math
import numpy as np

# Try importing MediaPipe solutions or tasks
MP_AVAILABLE = False
MP_SOLUTIONS = False

try:
    import mediapipe as mp
    MP_AVAILABLE = True
    if hasattr(mp, 'solutions') and hasattr(mp.solutions, 'hands'):
        MP_SOLUTIONS = True
except Exception:
    MP_AVAILABLE = False

class LandmarkPoint:
    def __init__(self, x, y, z=0.0):
        self.x = x
        self.y = y
        self.z = z

class HandDetector:
    def __init__(self, max_num_hands=1, min_detection_confidence=0.7, min_tracking_confidence=0.7):
        self.use_mp_solutions = MP_SOLUTIONS

        if self.use_mp_solutions:
            self.mp_hands = mp.solutions.hands
            self.mp_drawing = mp.solutions.drawing_utils
            self.mp_drawing_styles = mp.solutions.drawing_styles
            
            self.hands = self.mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=max_num_hands,
                min_detection_confidence=min_detection_confidence,
                min_tracking_confidence=min_tracking_confidence
            )

    def process_frame(self, frame):
        """
        Processes a BGR frame, extracts hand landmarks and draws visual overlays.
        Returns: processed_frame, landmarks_list, is_hand_detected
        """
        h, w, c = frame.shape

        if self.use_mp_solutions:
            try:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = self.hands.process(rgb_frame)

                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        self.mp_drawing.draw_landmarks(
                            frame,
                            hand_landmarks,
                            self.mp_hands.HAND_CONNECTIONS,
                            self.mp_drawing_styles.get_default_hand_landmarks_style(),
                            self.mp_drawing_styles.get_default_hand_connections_style()
                        )
                        return frame, hand_landmarks.landmark, True
            except Exception as e:
                pass

        # Fallback Computer Vision Hand Detection Pipeline (OpenCV Contour & Convexity Defects)
        return self._detect_opencv_hand(frame)

    def _detect_opencv_hand(self, frame):
        h, w, _ = frame.shape
        # Convert to YCrCb for skin color segmentation
        ycrcb = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
        lower_skin = np.array([0, 133, 77], dtype=np.uint8)
        upper_skin = np.array([255, 173, 127], dtype=np.uint8)
        
        mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
        mask = cv2.GaussianBlur(mask, (5, 5), 0)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return frame, [], False

        # Find largest contour (candidate hand region)
        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)

        if area < 5000:  # Minimum hand size threshold
            return frame, [], False

        # Compute bounding rectangle and centroid (wrist)
        x_rect, y_rect, w_rect, h_rect = cv2.boundingRect(largest_contour)
        M = cv2.moments(largest_contour)
        if M["m00"] == 0:
            return frame, [], False

        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])

        # Draw contour & bounding box visual overlays
        cv2.drawContours(frame, [largest_contour], -1, (0, 255, 170), 2)
        cv2.circle(frame, (cx, cy), 8, (0, 215, 255), -1)

        # Convex Hull and Defects to extract fingertips
        hull = cv2.convexHull(largest_contour, returnPoints=False)
        if len(hull) < 3:
            return frame, [], False

        defects = cv2.convexityDefects(largest_contour, hull)
        
        fingertips = []
        if defects is not None:
            for i in range(len(defects)):
                item = defects[i]
                if hasattr(item, '__len__') and len(item) == 1:
                    item = item[0]
                if hasattr(item, '__len__') and len(item) == 4:
                    s, e, f, d = item
                    start = tuple(largest_contour[s][0])
                    if d > 12000 and start[1] < cy:
                        fingertips.append(start)
                        cv2.circle(frame, start, 7, (255, 0, 128), -1)

        # Build 21 normalized landmarks array
        landmarks = [LandmarkPoint(cx / w, cy / h, 0.0)] * 21
        landmarks[0] = LandmarkPoint(cx / w, cy / h, 0.0)  # Wrist

        if fingertips:
            sorted_tips = sorted(fingertips, key=lambda pt: pt[0])
            tip_ids = [4, 8, 12, 16, 20]
            for idx, tip_pt in enumerate(sorted_tips[:5]):
                target_id = tip_ids[min(idx, 4)]
                landmarks[target_id] = LandmarkPoint(tip_pt[0] / w, tip_pt[1] / h, 0.0)
                landmarks[target_id - 2] = LandmarkPoint((tip_pt[0] + cx) / (2 * w), (tip_pt[1] + cy) / (2 * h), 0.0)

        return frame, landmarks, True
