from pydantic import BaseModel
from typing import Optional, List, Literal
from uuid import UUID
from datetime import datetime


DepartmentType = Literal["Engineering", "Sales", "Marketing", "HR", "Product"]
JobType = Literal["Full-time", "Contract", "Remote"]
JobStatus = Literal["Open", "Closed", "Draft"]


class JobBase(BaseModel):
    """Base job schema."""
    title: str
    department: DepartmentType
    location: str
    job_type: JobType
    description: Optional[str] = None
    requirements: Optional[List[str]] = None


class JobCreate(JobBase):
    """Schema for creating a job."""
    pass


class JobUpdate(BaseModel):
    """Schema for updating a job."""
    title: Optional[str] = None
    department: Optional[DepartmentType] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    status: Optional[JobStatus] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None


class JobResponse(JobBase):
    """Job response schema."""
    id: UUID
    status: JobStatus
    applicants_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
