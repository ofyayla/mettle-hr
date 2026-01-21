from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ApplicationBase(BaseModel):
    """Base application schema."""
    candidate_id: UUID
    job_id: UUID
    stage: str = "Applied"


class ApplicationCreate(ApplicationBase):
    """Schema for creating an application."""
    pass


class ApplicationUpdate(BaseModel):
    """Schema for updating an application."""
    stage: str


class ApplicationResponse(ApplicationBase):
    """Application response schema."""
    id: UUID
    applied_at: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
