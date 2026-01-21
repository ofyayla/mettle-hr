"""
Backend API E2E Tests

Run with: pytest tests/ -v
"""
import pytest
from httpx import AsyncClient, ASGITransport
import asyncio

# Import the FastAPI app
import sys
sys.path.insert(0, '..')
from app.main import app
from app.database import get_db, async_session_maker


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def client():
    """Create async HTTP client for testing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


class TestHealthEndpoint:
    """Test health check endpoint."""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test that health endpoint returns healthy status."""
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, client):
        """Test root endpoint returns ok."""
        response = await client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


class TestJobsAPI:
    """Test Jobs CRUD endpoints."""
    
    created_job_id = None
    
    @pytest.mark.asyncio
    async def test_list_jobs_empty(self, client):
        """Test listing jobs returns array."""
        response = await client.get("/api/jobs")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    @pytest.mark.asyncio
    async def test_create_job(self, client):
        """Test creating a new job."""
        job_data = {
            "title": "E2E Test Engineer",
            "department": "Engineering",
            "location": "Remote",
            "job_type": "Full-time",
            "description": "Testing position",
            "requirements": ["pytest", "selenium"]
        }
        response = await client.post("/api/jobs", json=job_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["title"] == job_data["title"]
        assert data["department"] == job_data["department"]
        assert data["status"] == "Draft"
        assert "id" in data
        
        # Store for later tests
        TestJobsAPI.created_job_id = data["id"]
    
    @pytest.mark.asyncio
    async def test_get_job(self, client):
        """Test getting a single job by ID."""
        if not TestJobsAPI.created_job_id:
            pytest.skip("No job created yet")
        
        response = await client.get(f"/api/jobs/{TestJobsAPI.created_job_id}")
        assert response.status_code == 200
        assert response.json()["id"] == TestJobsAPI.created_job_id
    
    @pytest.mark.asyncio
    async def test_update_job(self, client):
        """Test updating a job."""
        if not TestJobsAPI.created_job_id:
            pytest.skip("No job created yet")
        
        update_data = {"status": "Open", "title": "Updated E2E Engineer"}
        response = await client.patch(
            f"/api/jobs/{TestJobsAPI.created_job_id}",
            json=update_data
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Open"
        assert response.json()["title"] == "Updated E2E Engineer"
    
    @pytest.mark.asyncio
    async def test_delete_job(self, client):
        """Test deleting a job."""
        if not TestJobsAPI.created_job_id:
            pytest.skip("No job created yet")
        
        response = await client.delete(f"/api/jobs/{TestJobsAPI.created_job_id}")
        assert response.status_code == 204
        
        # Verify deleted
        response = await client.get(f"/api/jobs/{TestJobsAPI.created_job_id}")
        assert response.status_code == 404


class TestCandidatesAPI:
    """Test Candidates CRUD endpoints."""
    
    created_candidate_id = None
    test_email = f"e2e_test_{asyncio.get_event_loop().time()}@test.com"
    
    @pytest.mark.asyncio
    async def test_list_candidates(self, client):
        """Test listing candidates returns array."""
        response = await client.get("/api/candidates")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    @pytest.mark.asyncio
    async def test_create_candidate(self, client):
        """Test creating a new candidate."""
        import time
        candidate_data = {
            "name": "E2E Test Candidate",
            "email": f"e2e_{int(time.time())}@test.com",
            "role": "QA Engineer",
            "source": "LinkedIn",
            "skills": ["pytest", "selenium", "playwright"],
            "location": "Istanbul",
            "summary": "E2E test candidate"
        }
        response = await client.post("/api/candidates", json=candidate_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["name"] == candidate_data["name"]
        assert data["status"] == "New"
        assert data["score"] == 0
        assert "id" in data
        
        TestCandidatesAPI.created_candidate_id = data["id"]
    
    @pytest.mark.asyncio
    async def test_get_candidate(self, client):
        """Test getting a single candidate."""
        if not TestCandidatesAPI.created_candidate_id:
            pytest.skip("No candidate created yet")
        
        response = await client.get(
            f"/api/candidates/{TestCandidatesAPI.created_candidate_id}"
        )
        assert response.status_code == 200
        assert response.json()["id"] == TestCandidatesAPI.created_candidate_id
    
    @pytest.mark.asyncio
    async def test_update_candidate_status(self, client):
        """Test updating candidate status (pipeline move)."""
        if not TestCandidatesAPI.created_candidate_id:
            pytest.skip("No candidate created yet")
        
        update_data = {"status": "Screening", "score": 75}
        response = await client.patch(
            f"/api/candidates/{TestCandidatesAPI.created_candidate_id}",
            json=update_data
        )
        assert response.status_code == 200
        assert response.json()["status"] == "Screening"
        assert response.json()["score"] == 75
    
    @pytest.mark.asyncio
    async def test_delete_candidate(self, client):
        """Test deleting a candidate."""
        if not TestCandidatesAPI.created_candidate_id:
            pytest.skip("No candidate created yet")
        
        response = await client.delete(
            f"/api/candidates/{TestCandidatesAPI.created_candidate_id}"
        )
        assert response.status_code == 204


class TestApplicationsAPI:
    """Test Applications (job-candidate linking) endpoints."""
    
    job_id = None
    candidate_id = None
    application_id = None
    
    @pytest.mark.asyncio
    async def test_setup_job_and_candidate(self, client):
        """Create job and candidate for application tests."""
        import time
        
        # Create job
        job_response = await client.post("/api/jobs", json={
            "title": "Application Test Job",
            "department": "Engineering",
            "location": "Remote",
            "job_type": "Full-time"
        })
        assert job_response.status_code == 201
        TestApplicationsAPI.job_id = job_response.json()["id"]
        
        # Create candidate
        candidate_response = await client.post("/api/candidates", json={
            "name": "Application Test Candidate",
            "email": f"app_test_{int(time.time())}@test.com",
            "role": "Developer",
            "source": "CareerPage",
            "skills": ["Python"]
        })
        assert candidate_response.status_code == 201
        TestApplicationsAPI.candidate_id = candidate_response.json()["id"]
    
    @pytest.mark.asyncio
    async def test_create_application(self, client):
        """Test creating an application (linking candidate to job)."""
        if not TestApplicationsAPI.job_id or not TestApplicationsAPI.candidate_id:
            pytest.skip("Prerequisites not met")
        
        app_data = {
            "candidate_id": TestApplicationsAPI.candidate_id,
            "job_id": TestApplicationsAPI.job_id,
            "stage": "Applied"
        }
        response = await client.post("/api/applications", json=app_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["stage"] == "Applied"
        TestApplicationsAPI.application_id = data["id"]
    
    @pytest.mark.asyncio
    async def test_update_application_stage(self, client):
        """Test updating application stage (pipeline movement)."""
        if not TestApplicationsAPI.application_id:
            pytest.skip("No application created")
        
        response = await client.patch(
            f"/api/applications/{TestApplicationsAPI.application_id}",
            json={"stage": "Interview"}
        )
        assert response.status_code == 200
        assert response.json()["stage"] == "Interview"
    
    @pytest.mark.asyncio
    async def test_list_applications_by_job(self, client):
        """Test filtering applications by job."""
        if not TestApplicationsAPI.job_id:
            pytest.skip("No job created")
        
        response = await client.get(
            f"/api/applications?job_id={TestApplicationsAPI.job_id}"
        )
        assert response.status_code == 200
        apps = response.json()
        assert len(apps) >= 1
        assert all(a["job_id"] == TestApplicationsAPI.job_id for a in apps)


class TestIntegrationFlow:
    """Test complete ATS workflow end-to-end."""
    
    @pytest.mark.asyncio
    async def test_complete_hiring_flow(self, client):
        """
        Test complete hiring flow:
        1. Create job posting
        2. Add candidate
        3. Create application
        4. Move through pipeline stages
        5. Verify final state
        """
        import time
        
        # 1. Create job
        job_response = await client.post("/api/jobs", json={
            "title": "Full Stack Developer",
            "department": "Engineering",
            "location": "Istanbul (Hybrid)",
            "job_type": "Full-time",
            "description": "Looking for a full stack developer",
            "requirements": ["React", "Python", "PostgreSQL"]
        })
        assert job_response.status_code == 201
        job = job_response.json()
        job_id = job["id"]
        
        # Update to Open status
        await client.patch(f"/api/jobs/{job_id}", json={"status": "Open"})
        
        # 2. Add candidate
        candidate_response = await client.post("/api/candidates", json={
            "name": "Jane Developer",
            "email": f"jane_{int(time.time())}@example.com",
            "role": "Full Stack Developer",
            "source": "LinkedIn",
            "skills": ["React", "Python", "TypeScript"],
            "location": "Istanbul",
            "summary": "5 years experience in full stack development"
        })
        assert candidate_response.status_code == 201
        candidate = candidate_response.json()
        candidate_id = candidate["id"]
        
        # 3. Create application
        app_response = await client.post("/api/applications", json={
            "candidate_id": candidate_id,
            "job_id": job_id,
            "stage": "Applied"
        })
        assert app_response.status_code == 201
        application = app_response.json()
        app_id = application["id"]
        
        # 4. Move through pipeline
        stages = ["Screening", "Interview", "Offer"]
        for stage in stages:
            response = await client.patch(
                f"/api/applications/{app_id}",
                json={"stage": stage}
            )
            assert response.status_code == 200
            assert response.json()["stage"] == stage
        
        # Update candidate to Hired
        hired_response = await client.patch(
            f"/api/candidates/{candidate_id}",
            json={"status": "Hired"}
        )
        assert hired_response.status_code == 200
        assert hired_response.json()["status"] == "Hired"
        
        # 5. Verify final state
        final_candidate = await client.get(f"/api/candidates/{candidate_id}")
        assert final_candidate.json()["status"] == "Hired"
        
        print("\n✅ Complete hiring flow test passed!")
