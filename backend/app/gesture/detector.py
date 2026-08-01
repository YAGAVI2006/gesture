import os
import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Hand Landmark Skeleton Connection Pairs
HAND_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 4),        # Thumb
    (0, 5), (5, 6), (6, 7), (7, 8),        # Index
    (5, 9), (9, 10), (10, 11), (11, 12),   # Middle
    (9, 13), (13, 14), (14, 15), (15, 16), # Ring
    (13, 17), (0, 17), (17, 18), (18, 19), (19, 20) # Pinky
]

class HandDetector:
    def __init__(self, max_num_hands=1, min_detection_confidence=0.6):
        self.detector = None
        self.model_path = os.path.join(os.path.dirname(__file__), 'hand_landmarker.task')

        if os.path.exists(self.model_path):
            try:
                base_options = python.BaseOptions(model_asset_path=self.model_path)
                options = vision.HandLandmarkerOptions(
                    base_options=base_options,
                    running_mode=vision.RunningMode.IMAGE,
                    num_hands=max_num_hands,
                    min_hand_detection_confidence=min_detection_confidence
                )
                self.detector = vision.HandLandmarker.create_from_options(options)
            except Exception as e:
                print(f"HandLandmarker load error: {e}")

    def process_frame(self, frame):
        """
        Processes a BGR frame, extracts 21 3D hand landmarks via MediaPipe HandLandmarker,
        and draws visual skeleton connections and landmark points.
        Returns: processed_frame, landmarks_list, is_hand_detected
        """
        h, w, _ = frame.shape

        if self.detector is not None:
            try:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
                detection_result = self.detector.detect(mp_image)

                if detection_result.hand_landmarks:
                    landmarks = detection_result.hand_landmarks[0]

                    # Draw skeleton connections
                    for p1, p2 in HAND_CONNECTIONS:
                        pt1 = (int(landmarks[p1].x * w), int(landmarks[p1].y * h))
                        pt2 = (int(landmarks[p2].x * w), int(landmarks[p2].y * h))
                        cv2.line(frame, pt1, pt2, (0, 255, 170), 2)

                    # Draw landmark nodes
                    for idx, lm in enumerate(landmarks):
                        cx, cy = int(lm.x * w), int(lm.y * h)
                        # Highlight fingertips (4, 8, 12, 16, 20) with glowing cyan circles
                        if idx in [4, 8, 12, 16, 20]:
                            cv2.circle(frame, (cx, cy), 8, (0, 215, 255), -1)
                            cv2.circle(frame, (cx, cy), 10, (255, 255, 255), 1)
                        else:
                            cv2.circle(frame, (cx, cy), 4, (0, 255, 170), -1)

                    return frame, landmarks, True
            except Exception as e:
                pass

        # Fallback if model not loaded or error occurs
        return frame, [], False
