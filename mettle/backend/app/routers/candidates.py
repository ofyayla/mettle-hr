from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate, CandidateUpdate, CandidateResponse

router = APIRouter()


@router.get("", response_model=List[CandidateResponse])
async def list_candidates(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    source: str = None,
    db: AsyncSession = Depends(get_db),
):
    """List all candidates with optional filtering."""
    query = select(Candidate).order_by(Candidate.created_at.desc())
    
    if status_filter:
        query = query.where(Candidate.status == status_filter)
    if source:
        query = query.where(Candidate.source == source)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(candidate_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single candidate by ID."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.post("", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def create_candidate(
    candidate_data: CandidateCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new candidate."""
    # Check if email exists
    result = await db.execute(
        select(Candidate).where(Candidate.email == candidate_data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Candidate with this email already exists")
    
    # Calculate experience years from experience list
    experience_years = len(candidate_data.experience) if candidate_data.experience else 0
    
    candidate = Candidate(
        name=candidate_data.name,
        email=candidate_data.email,
        phone=candidate_data.phone,
        photo_url=candidate_data.photo_url,
        role=candidate_data.role,
        source=candidate_data.source,
        location=candidate_data.location,
        skills=candidate_data.skills,
        tags=candidate_data.skills[:3] if candidate_data.skills else [],
        summary=candidate_data.summary,
        experience=[exp.model_dump() for exp in candidate_data.experience] if candidate_data.experience else None,
        education=[edu.model_dump() for edu in candidate_data.education] if candidate_data.education else None,
        certifications=[cert.model_dump() for cert in candidate_data.certifications] if candidate_data.certifications else None,
        experience_years=experience_years,
        status="New",
        score=0,
    )
    db.add(candidate)
    await db.flush()
    await db.refresh(candidate)
    return candidate


@router.patch("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: UUID,
    candidate_data: CandidateUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing candidate."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    update_data = candidate_data.model_dump(exclude_unset=True)
    
    # Handle nested objects
    if "experience" in update_data and update_data["experience"]:
        update_data["experience"] = [exp.model_dump() if hasattr(exp, 'model_dump') else exp for exp in update_data["experience"]]
    if "education" in update_data and update_data["education"]:
        update_data["education"] = [edu.model_dump() if hasattr(edu, 'model_dump') else edu for edu in update_data["education"]]
    if "certifications" in update_data and update_data["certifications"]:
        update_data["certifications"] = [cert.model_dump() if hasattr(cert, 'model_dump') else cert for cert in update_data["certifications"]]
    
    for field, value in update_data.items():
        setattr(candidate, field, value)
    
    await db.flush()
    await db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_candidate(candidate_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a candidate."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    await db.delete(candidate)
