import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.db.database import init_db
from app.api.routes import router as api_router
from app.services.websocket import ws_manager
from app.gesture.engine import gesture_engine
from app.voice.listener import voice_listener
from app.services.logger import log_activity
from app.config import settings

app = FastAPI(
    title="AI Gesture HCI & IoT System API",
    description="Backend API and WebSocket engine for AI-Powered Gesture-Based Human-Computer Interaction & IoT Control",
    version="1.0.0"
)

# CORS middleware for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    # Initialize SQLite database
    init_db()
    
    # Register voice command callback
    voice_listener.set_callback(log_activity)
    
    # Auto-start gesture camera loop
    gesture_engine.start_camera(settings.camera_index)

@app.on_event("shutdown")
async def shutdown_event():
    gesture_engine.stop_camera()
    voice_listener.stop()

@app.get("/")
def root():
    return {
        "system": "AI-Powered Gesture-Based HCI & IoT Control System",
        "status": "ONLINE",
        "docs": "/docs",
        "websocket": "/ws",
        "video_feed": "/api/video_feed"
    }

@app.get("/api/video_feed")
def video_feed():
    """MJPEG Live Camera Stream Endpoint"""
    return StreamingResponse(
        gesture_engine.generate_mjpeg_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send initial state telemetry upon connection
        await websocket.send_json(gesture_engine.get_telemetry())
        
        while True:
            # Keep socket open and receive any client messages
            data = await websocket.receive_text()
            # Broadcast heartbeat or response if needed
            await websocket.send_json({"type": "PONG", "received": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)
