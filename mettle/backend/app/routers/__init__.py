from app.routers.jobs import router as jobs_router
from app.routers.candidates import router as candidates_router
from app.routers.applications import router as applications_router
from app.routers.auth import router as auth_router

# Re-export for main.py
jobs = type('Module', (), {'router': jobs_router})()
candidates = type('Module', (), {'router': candidates_router})()
applications = type('Module', (), {'router': applications_router})()
auth = type('Module', (), {'router': auth_router})()
