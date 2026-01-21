from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.candidate import Candidate
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse

router = APIRouter()


@router.get("", response_model=List[ApplicationResponse])
async def list_applications(
    job_id: UUID = None,
    candidate_id: UUID = None,
    stage: str = None,
    db: AsyncSession = Depends(get_db),
):
    """List applications with optional filtering by job, candidate, or stage."""
    query = select(Application).order_by(Application.applied_at.desc())
    
    if job_id:
        query = query.where(Application.job_id == job_id)
    if candidate_id:
        query = query.where(Application.candidate_id == candidate_id)
    if stage:
        query = query.where(Application.stage == stage)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(application_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single application by ID."""
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new application (link candidate to job)."""
    # Verify job exists
    job_result = await db.execute(select(Job).where(Job.id == app_data.job_id))
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Verify candidate exists
    candidate_result = await db.execute(
        select(Candidate).where(Candidate.id == app_data.candidate_id)
    )
    if not candidate_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Check for duplicate application
    existing = await db.execute(
        select(Application).where(
            Application.candidate_id == app_data.candidate_id,
            Application.job_id == app_data.job_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Application already exists")
    
    application = Application(
        candidate_id=app_data.candidate_id,
        job_id=app_data.job_id,
        stage=app_data.stage,
    )
    db.add(application)
    
    # Increment job applicants count
    job.applicants_count += 1
    
    await db.flush()
    await db.refresh(application)
    return application


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: UUID,
    app_data: ApplicationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update application stage (for pipeline movements)."""
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.stage = app_data.stage
    await db.flush()
    await db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(application_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete an application."""
    result = await db.execute(select(Application).where(Application.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Decrement job applicants count
    job_result = await db.execute(select(Job).where(Job.id == application.job_id))
    job = job_result.scalar_one_or_none()
    if job and job.applicants_count > 0:
        job.applicants_count -= 1
    
    await db.delete(application)
