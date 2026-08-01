from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, Dict, Any, List

from app.db.database import get_db
from app.db.models import ActivityLog
from app.config import settings, SystemSettings
from app.gesture.engine import gesture_engine
from app.iot.manager import iot_manager
from app.presentation.controller import presentation_controller
from app.voice.listener import voice_listener
from app.services.logger import log_activity

router = APIRouter(prefix="/api")

@router.get("/status")
def get_status():
    return gesture_engine.get_telemetry()

@router.get("/logs")
def get_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(limit).all()
    return [log.to_dict() for log in logs]

@router.delete("/logs")
def clear_logs(db: Session = Depends(get_db)):
    db.query(ActivityLog).delete()
    db.commit()
    return {"status": "success", "message": "All activity logs cleared"}

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total_logs = db.query(ActivityLog).count()
    
    # Most frequent gesture
    most_frequent_gesture_query = (
        db.query(ActivityLog.gesture, func.count(ActivityLog.gesture).label("count"))
        .filter(ActivityLog.gesture.isnot(None))
        .group_by(ActivityLog.gesture)
        .order_by(func.count(ActivityLog.gesture).desc())
        .first()
    )
    most_frequent_gesture = most_frequent_gesture_query[0] if most_frequent_gesture_query else "None"

    # Total IoT commands
    total_iot_commands = db.query(ActivityLog).filter(
        ActivityLog.command.in_(["LIGHT_ON", "LIGHT_OFF", "FAN_ON", "FAN_OFF"])
    ).count()

    # Total computer commands
    total_computer_commands = db.query(ActivityLog).filter(
        ActivityLog.command.in_(["MOUSE_CLICK", "MOUSE_DOUBLE_CLICK", "SLIDE_NEXT", "SLIDE_PREV"])
    ).count()

    # Gesture breakdown
    gesture_counts = (
        db.query(ActivityLog.gesture, func.count(ActivityLog.gesture))
        .filter(ActivityLog.gesture.isnot(None))
        .group_by(ActivityLog.gesture)
        .all()
    )
    gesture_breakdown = [{"name": g[0], "value": g[1]} for g in gesture_counts]

    # Source breakdown
    source_counts = (
        db.query(ActivityLog.source, func.count(ActivityLog.source))
        .group_by(ActivityLog.source)
        .all()
    )
    source_breakdown = [{"source": s[0], "count": s[1]} for s in source_counts]

    return {
        "total_gestures_detected": total_logs,
        "most_frequent_gesture": most_frequent_gesture,
        "total_iot_commands": total_iot_commands,
        "total_computer_commands": total_computer_commands,
        "gesture_breakdown": gesture_breakdown,
        "source_breakdown": source_breakdown
    }

@router.get("/settings")
def get_settings():
    return settings.dict()

@router.post("/settings")
def update_settings(new_settings: Dict[str, Any]):
    for key, value in new_settings.items():
        if hasattr(settings, key):
            setattr(settings, key, value)
    
    # Handle voice listener state change
    if settings.voice_control_enabled:
        voice_listener.start()
    else:
        voice_listener.stop()

    return {"status": "success", "settings": settings.dict()}

@router.post("/control/camera")
def control_camera(payload: Dict[str, str]):
    action = payload.get("action", "").lower()
    if action == "start":
        gesture_engine.start_camera(settings.camera_index)
        log_activity("System", 1.0, "CAMERA_STARTED", "Webcam", source="manual")
        return {"status": "success", "message": "Camera started"}
    elif action == "stop":
        gesture_engine.stop_camera()
        log_activity("System", 1.0, "CAMERA_STOPPED", "Webcam", source="manual")
        return {"status": "success", "message": "Camera stopped"}
    raise HTTPException(status_code=400, detail="Invalid action. Use 'start' or 'stop'.")

@router.post("/control/iot")
def control_iot(payload: Dict[str, str]):
    device = payload.get("device", "")
    action = payload.get("action", "")
    res = iot_manager.execute_command(device, action, source="manual")
    if res.get("status") == "success":
        cmd_name = f"{device.upper()}_{action.upper()}"
        log_activity("Manual Override", 1.0, cmd_name, res.get("device"), source="manual")
    return res

@router.post("/control/presentation")
def control_presentation(payload: Dict[str, str]):
    action = payload.get("action", "").lower()
    if action == "start":
        presentation_controller.start_presentation()
        log_activity("Presentation", 1.0, "SLIDE_START", "Presentation", source="manual")
    elif action == "exit":
        presentation_controller.exit_presentation()
        log_activity("Presentation", 1.0, "SLIDE_EXIT", "Presentation", source="manual")
    elif action == "next":
        presentation_controller.next_slide()
        log_activity("Presentation", 1.0, "SLIDE_NEXT", "Presentation", source="manual")
    elif action == "prev":
        presentation_controller.prev_slide()
        log_activity("Presentation", 1.0, "SLIDE_PREV", "Presentation", source="manual")
    return {"status": "success", "presentation_mode": settings.presentation_mode}

@router.post("/control/toggles")
def toggle_feature(payload: Dict[str, Any]):
    feature = payload.get("feature", "").lower()
    enabled = payload.get("enabled", True)
    
    if feature == "gesture":
        settings.gesture_control_enabled = enabled
    elif feature == "computer":
        settings.computer_control_enabled = enabled
    elif feature == "iot":
        settings.iot_control_enabled = enabled
    elif feature == "voice":
        settings.voice_control_enabled = enabled
        if enabled:
            voice_listener.start()
        else:
            voice_listener.stop()
    elif feature == "presentation":
        settings.presentation_mode = enabled
    else:
        raise HTTPException(status_code=400, detail="Invalid feature")

    return {"status": "success", "feature": feature, "enabled": enabled}
