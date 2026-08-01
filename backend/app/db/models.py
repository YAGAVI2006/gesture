from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    gesture = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    command = Column(String, nullable=False)
    device = Column(String, nullable=True)
    source = Column(String, nullable=False, default="gesture")  # gesture, voice, manual, system
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "gesture": self.gesture,
            "confidence": round(self.confidence, 2) if self.confidence else None,
            "command": self.command,
            "device": self.device,
            "source": self.source,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
