# AI-Powered Gesture-Based Smart Human–Computer Interaction & IoT Control System

An enterprise-grade, full-stack Human-Computer Interaction (HCI) and Internet of Things (IoT) control system powered by Computer Vision and AI. The application leverages a standard webcam to detect 21 3D hand landmarks in real time using **MediaPipe**, classifies static and dynamic gestures, and translates them into system cursor movements, PowerPoint slide controls, and simulated smart IoT devices (**Smart Light** and **Smart Fan**).

---

## 🌟 System Architecture

```mermaid
graph TD
    A[Webcam / Camera Engine] -->|RGB Video Stream| B[MediaPipe Hands Model]
    B -->|21 3D Landmarks| C[Vector Gesture Classifier]
    C -->|Gesture & Confidence| D{Command Dispatcher}
    
    D -->|Index Finger / Peace / Pinch| E[PyAutoGUI HCI Engine]
    D -->|Swipe Left / Right| F[Presentation Controller]
    D -->|Fist / Open Palm / Thumbs Up| G[Virtual IoT Manager]
    
    E --> H[Desktop Cursor & Click Actions]
    F --> I[PowerPoint / Keynote Navigation]
    G --> J[Virtual Light & Fan State Engine]
    
    G --> K[WebSocket Broadcast Manager]
    E --> K
    F --> K
    
    K -->|ws://localhost:8000/ws| L[React Web Dashboard]
    D -->|Persistent Audit Logs| M[(SQLite Database)]
```

---

## 🚀 Key Features

1. **AI Hand Gesture Engine**:
   - Real-time 21 3D hand landmark tracking using MediaPipe & OpenCV.
   - Dynamic gesture recognition algorithm evaluating vector angles and spatial distances.
   - Calculates FPS, confidence score %, and tracking status in real time.
2. **Gesture-Based HCI Computer Control**:
   - **Index Finger Pointing** → Move mouse cursor smoothly (with exponential moving average interpolation).
   - **Peace Gesture** → Mouse left click.
   - **Pinch Gesture** → Mouse double click / select.
   - Configurable safety cooldown (default 1.5s) to eliminate accidental double-triggers.
3. **PowerPoint Presentation Control**:
   - **Swipe Right** → Next slide.
   - **Swipe Left** → Previous slide.
   - Presentation start (`F5`) and exit (`Esc`) triggers.
4. **Virtual IoT Control & Abstraction Layer**:
   - Simulated **Smart Light** (brightness, state, glowing UI animation).
   - Simulated **Smart Fan** (speed level, state, spinning UI animation).
   - Clean `BaseIoTDevice` abstraction layer ready for MQTT / physical ESP32 microcontrollers.
5. **Optional Speech Recognition**:
   - Background voice command listener ("turn on light", "turn off fan", "presentation mode").
   - Non-blocking execution with automatic fallback if no microphone is connected.
6. **Real-Time Web Dashboard (React + Tailwind CSS + Recharts)**:
   - High-contrast dark mode glassmorphism UI.
   - Live MJPEG video stream canvas.
   - Interactive activity log stream with CSV export.
   - System usage analytics & Recharts visual graphs.
   - Manual override controls for offline testing.

---

## 🖐️ Gesture-to-Command Mapping Reference

| Gesture | Visual | Action Triggered | Target Subsystem |
| :--- | :---: | :--- | :--- |
| **Index Finger** | 👆 | Smooth Mouse Cursor Movement | Computer HCI |
| **Peace / Two Fingers** | ✌️ | Mouse Left Click | Computer HCI |
| **Pinch** | 🤏 | Mouse Double Click / Select | Computer HCI |
| **Fist** | ✊ | Turn Smart Light **ON** | Virtual IoT |
| **Open Palm** | ✋ | Turn Smart Fan **OFF** | Virtual IoT |
| **Thumbs Up** | 👍 | Turn Smart Light **OFF** | Virtual IoT |
| **Swipe Right** | 👉 | Next Slide | Presentation Mode |
| **Swipe Left** | 👈 | Previous Slide | Presentation Mode |

---

## 🛠️ Technology Stack

- **Backend**: Python 3.9+, FastAPI, MediaPipe, OpenCV, NumPy, PyAutoGUI, SpeechRecognition, SQLAlchemy, SQLite, Uvicorn, WebSockets.
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React Icons, Recharts, Axios, WebSockets.

---

## 📦 Installation & Setup Guide

### 1. Prerequisites
- **Python**: 3.9 or higher installed.
- **Node.js**: v18 or higher installed.
- **Webcam**: Standard USB or built-in laptop webcam (Optional; app will automatically render a synthetic stream if no camera is attached).

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server & AI Gesture Engine
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
> The API server will start on `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
> The Web Dashboard will open on `http://localhost:5173`.

---

## 📚 Documentation & Integration

Detailed technical documentation is available in the `docs/` folder:
- [Architecture Overview](file:///c:/Users/HP/Desktop/gesture/docs/architecture.md)
- [API & WebSocket Specification](file:///c:/Users/HP/Desktop/gesture/docs/api.md)
- [Project Flow & Data Pipeline](file:///c:/Users/HP/Desktop/gesture/docs/project-flow.md)
- [Physical ESP32 & MQTT Setup Guide](file:///c:/Users/HP/Desktop/gesture/docs/esp32_mqtt_guide.md)

---

## 📄 License
Engineering Final-Year Capstone Project — Open Source & Extensible Architecture.
