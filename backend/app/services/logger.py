import asyncio
from app.db.database import SessionLocal
from app.db.models import ActivityLog
from app.services.websocket import ws_manager

def log_activity(gesture: str, confidence: float, command: str, device: str = None, source: str = "gesture"):
    db = SessionLocal()
    try:
        log_entry = ActivityLog(
            gesture=gesture,
            confidence=confidence,
            command=command,
            device=device,
            source=source
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        
        # Broadcast log via WebSocket asynchronously
        payload = {
            "type": "NEW_LOG",
            "log": log_entry.to_dict()
        }
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.create_task(ws_manager.broadcast(payload))
        except Exception:
            pass

        return log_entry.to_dict()
    finally:
        db.close()
