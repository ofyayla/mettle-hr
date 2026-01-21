from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal, Any
from uuid import UUID
from datetime import datetime


SourceType = Literal["LinkedIn", "GitHub", "Referral", "CareerPage", "Indeed"]
CandidateStatus = Literal["New", "Screening", "Interview", "Offer", "Hired", "Rejected"]


class WorkExperience(BaseModel):
    """Work experience entry."""
    id: str
    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class Education(BaseModel):
    """Education entry."""
    id: str
    school: str
    degree: str
    start_date: str
    end_date: Optional[str] = None
    grade: Optional[str] = None


class Certification(BaseModel):
    """Certification entry."""
    id: str
    name: str
    issuer: str
    issue_date: str
    credential_id: Optional[str] = None


class CandidateBase(BaseModel):
    """Base candidate schema."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    photo_url: Optional[str] = None
    role: str
    source: SourceType
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    summary: Optional[str] = None
    experience: Optional[List[WorkExperience]] = None
    education: Optional[List[Education]] = None
    certifications: Optional[List[Certification]] = None


class CandidateCreate(CandidateBase):
    """Schema for creating a candidate."""
    applied_job_id: Optional[UUID] = None


class CandidateUpdate(BaseModel):
    """Schema for updating a candidate."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None
    role: Optional[str] = None
    source: Optional[SourceType] = None
    status: Optional[CandidateStatus] = None
    score: Optional[int] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    summary: Optional[str] = None
    resume_url: Optional[str] = None
    experience: Optional[List[WorkExperience]] = None
    education: Optional[List[Education]] = None
    certifications: Optional[List[Certification]] = None


class CandidateResponse(CandidateBase):
    """Candidate response schema."""
    id: UUID
    status: CandidateStatus
    score: int
    tags: Optional[List[str]] = None
    experience_years: int
    resume_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
