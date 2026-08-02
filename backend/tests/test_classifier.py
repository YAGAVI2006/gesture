import pytest
from app.gesture.classifier import GestureClassifier
from app.gesture.detector import LandmarkPoint

def test_calculate_distance():
    classifier = GestureClassifier()
    p1 = LandmarkPoint(0.0, 0.0, 0.0)
    p2 = LandmarkPoint(3.0, 4.0, 0.0)
    dist = classifier.calculate_distance(p1, p2)
    assert abs(dist - 5.0) < 1e-5

def test_no_hand_classification():
    classifier = GestureClassifier()
    gesture, confidence = classifier.classify([])
    assert gesture == "No Hand"
    assert confidence == 0.0

def test_finger_extension_check():
    classifier = GestureClassifier()
    landmarks = [LandmarkPoint(0.5, 0.8, 0.0)] * 21
    landmarks[0] = LandmarkPoint(0.5, 0.9, 0.0)   # Wrist
    landmarks[5] = LandmarkPoint(0.5, 0.7, 0.0)   # Index MCP
    landmarks[6] = LandmarkPoint(0.5, 0.5, 0.0)   # Index PIP
    landmarks[8] = LandmarkPoint(0.5, 0.2, 0.0)   # Index Tip

    is_ext = classifier.is_finger_extended(landmarks, 8, 6, 5)
    assert is_ext is True
