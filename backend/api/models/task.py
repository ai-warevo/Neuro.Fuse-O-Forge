from sqlalchemy import Column, String, DateTime, Text, Enum as SQLAlchemyEnum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from backend.shared.constants import TaskStatus, ForgeType

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True)
    status = Column(SQLAlchemyEnum(TaskStatus), default=TaskStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    type = Column(SQLAlchemyEnum(ForgeType))
    output_path = Column(String)
    error_message = Column(Text)

    __table_args__ = (
        {"mysql_charset": "utf8mb4"},
    )

def get_task_by_id(db: Session, task_id: str):
    return db.query(Task).filter(Task.id == task_id).first()