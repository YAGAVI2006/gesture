import time
import os
import psutil
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db

health_router = APIRouter(prefix="/api")
START_TIME = time.time()

@health_router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute("SELECT 1")
    except Exception:
        db_status = "unhealthy"

    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()

    return {
        "status": "UP" if db_status == "healthy" else "DEGRADED",
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "database": db_status,
        "memory_usage_mb": round(memory_info.rss / (1024 * 1024), 2)
    }
