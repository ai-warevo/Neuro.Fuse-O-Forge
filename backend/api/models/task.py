from sqlalchemy import Column, String, DateTime, JSON, Text, Enum as SQLAlchemyEnum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from backend.shared.constants import TaskStatus, ForgeType
import uuid

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(SQLAlchemyEnum(TaskStatus), default=TaskStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    type = Column(SQLAlchemyEnum(ForgeType))
    prompt = Column(String)
    params = Column(JSON)
    output_path = Column(String)
    error_message = Column(Text)

    __table_args__ = (
        {"mysql_charset": "utf8mb4"},
    )

async def get_task_by_id(db: AsyncSession, task_id: str):
    return await db.get(Task, task_id)