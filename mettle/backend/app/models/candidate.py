import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application


class Candidate(Base, TimestampMixin):
    """Candidate/applicant model."""
    
    __tablename__ = "candidates"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    role: Mapped[str] = mapped_column(String(255), nullable=False)  # Applied position
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # LinkedIn, GitHub, etc.
    status: Mapped[str] = mapped_column(String(50), default="New")  # New, Screening, Interview, etc.
    score: Mapped[int] = mapped_column(Integer, default=0)  # AI score 0-100
    
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    skills: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resume_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # JSON fields for complex nested data
    experience: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # Work history
    education: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    certifications: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Relationships
    applications: Mapped[List["Application"]] = relationship(
        "Application",
        back_populates="candidate",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<Candidate {self.name}>"
