import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application


class Job(Base, TimestampMixin):
    """Job posting model."""
    
    __tablename__ = "jobs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    department: Mapped[str] = mapped_column(String(100), nullable=False)  # Engineering, Sales, etc.
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    job_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Full-time, Contract, Remote
    status: Mapped[str] = mapped_column(String(50), default="Draft")  # Open, Closed, Draft
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    requirements: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    applicants_count: Mapped[int] = mapped_column(Integer, default=0)
    
    # Relationships
    applications: Mapped[List["Application"]] = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<Job {self.title}>"
