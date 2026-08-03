import time
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

health_router = APIRouter(prefix="/api")
START_TIME = time.time()

@health_router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    memory_mb = 0.0
    if PSUTIL_AVAILABLE:
        try:
            process = psutil.Process(os.getpid())
            memory_mb = round(process.memory_info().rss / (1024 * 1024), 2)
        except Exception:
            pass

    return {
        "status": "UP" if db_status == "healthy" else "DEGRADED",
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "database": db_status,
        "memory_usage_mb": memory_mb
    }
