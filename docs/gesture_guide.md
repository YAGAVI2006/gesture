# AI Hand Gesture Recognition Visual & Operational Guide

This document provides operational guidelines to achieve optimal gesture recognition performance with the **AI Gesture HCI & IoT System**.

---

## 🖐️ Gesture Operational Table

| Gesture Name | Hand Pose Description | Target Subsystem | Action |
| :--- | :--- | :--- | :--- |
| **Open Palm** | All 5 fingers fully extended, palm facing camera | Virtual IoT | Turns **Smart Fan OFF** |
| **Fist** | All 5 fingers folded inward tightly | Virtual IoT | Turns **Smart Light ON** |
| **Thumbs Up** | Thumb pointed upward, other 4 fingers folded | Virtual IoT | Turns **Smart Light OFF** |
| **Peace** | Index and Middle fingers extended upward, others folded | Computer HCI | Triggers **Mouse Left Click** |
| **Index Finger** | Only Index finger extended, others folded | Computer HCI | Moves **Cursor Smoothly** |
| **Pinch** | Index Tip and Thumb Tip close together (< 5cm) | Computer HCI | Triggers **Double Click / Select** |
| **Swipe Right** | Index finger or open hand moved rapidly from left to right | Presentation | Navigates to **Next Slide** |
| **Swipe Left** | Index finger or open hand moved rapidly from right to left | Presentation | Navigates to **Previous Slide** |

---

## 💡 Best Practices for Best Accuracy

1. **Distance**: Keep your hand between **0.4m to 1.2m** from the webcam.
2. **Lighting**: Ensure sufficient front or ambient room lighting (avoid heavy background backlighting).
3. **Background**: Simple, uncluttered background provides the fastest landmark extraction.
4. **Safety Cooldown**: The system enforces a default **1.2s delay** between state-changing commands to prevent double triggers.
