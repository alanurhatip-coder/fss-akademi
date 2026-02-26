"""
FSS Akademi - Teachers CRUD Backend Tests
Tests for the new Öğretmenlerimiz (Our Teachers) feature
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data tracking
created_teacher_ids = []

class TestTeachersAPIBasic:
    """Basic Teachers endpoint tests"""
    
    def test_api_root(self):
        """Test API is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root accessible: {data}")
    
    def test_get_all_teachers(self):
        """Test GET /api/teachers - list all teachers"""
        response = requests.get(f"{BASE_URL}/api/teachers")
        assert response.status_code == 200
        teachers = response.json()
        assert isinstance(teachers, list)
        print(f"✓ GET /api/teachers returned {len(teachers)} teachers")
        # Verify response structure if teachers exist
        if teachers:
            teacher = teachers[0]
            assert "id" in teacher
            assert "name" in teacher
            assert "title" in teacher
            print(f"  First teacher: {teacher.get('name')}")
    
    def test_get_active_teachers(self):
        """Test GET /api/teachers/active - list active teachers only"""
        response = requests.get(f"{BASE_URL}/api/teachers/active")
        assert response.status_code == 200
        teachers = response.json()
        assert isinstance(teachers, list)
        print(f"✓ GET /api/teachers/active returned {len(teachers)} active teachers")
        # Verify all returned teachers are active
        for teacher in teachers:
            assert teacher.get("isActive", True) == True, f"Teacher {teacher.get('name')} should be active"


class TestTeachersAPICreate:
    """Teacher creation tests"""
    
    def test_create_teacher_success(self):
        """Test POST /api/teachers - create a new teacher"""
        test_teacher = {
            "name": "TEST_Test Teacher",
            "title": "Test Title",
            "bio": "This is a test bio for the test teacher",
            "photoUrl": "https://example.com/photo.jpg",
            "isActive": True,
            "order": 99
        }
        
        response = requests.post(
            f"{BASE_URL}/api/teachers",
            json=test_teacher,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        created = response.json()
        
        # Validate response structure
        assert "id" in created, "Created teacher should have an ID"
        assert created["name"] == test_teacher["name"]
        assert created["title"] == test_teacher["title"]
        assert created["bio"] == test_teacher["bio"]
        assert created["photoUrl"] == test_teacher["photoUrl"]
        assert created["isActive"] == test_teacher["isActive"]
        assert created["order"] == test_teacher["order"]
        
        # Track for cleanup
        created_teacher_ids.append(created["id"])
        print(f"✓ POST /api/teachers created teacher with ID: {created['id']}")
        
        return created["id"]
    
    def test_create_teacher_minimal_data(self):
        """Test POST /api/teachers with only required fields"""
        test_teacher = {
            "name": "TEST_Minimal Teacher",
            "title": "Minimal Title"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/teachers",
            json=test_teacher,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        created = response.json()
        
        assert created["name"] == test_teacher["name"]
        assert created["title"] == test_teacher["title"]
        assert created.get("isActive", True) == True  # Default should be True
        
        created_teacher_ids.append(created["id"])
        print(f"✓ Created teacher with minimal data: {created['id']}")
    
    def test_create_teacher_verify_persistence(self):
        """Test that created teacher persists in database (Create -> GET verification)"""
        test_teacher = {
            "name": "TEST_Persistence Check",
            "title": "Persistence Title",
            "bio": "Testing data persistence"
        }
        
        # Create
        create_response = requests.post(
            f"{BASE_URL}/api/teachers",
            json=test_teacher,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        created = create_response.json()
        teacher_id = created["id"]
        created_teacher_ids.append(teacher_id)
        
        # GET all and verify teacher exists
        get_response = requests.get(f"{BASE_URL}/api/teachers")
        assert get_response.status_code == 200
        teachers = get_response.json()
        
        # Find our created teacher
        found_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
        assert found_teacher is not None, f"Created teacher {teacher_id} not found in list"
        assert found_teacher["name"] == test_teacher["name"]
        assert found_teacher["title"] == test_teacher["title"]
        assert found_teacher["bio"] == test_teacher["bio"]
        
        print(f"✓ Teacher persistence verified: {teacher_id}")


class TestTeachersAPIUpdate:
    """Teacher update tests"""
    
    def test_update_teacher(self):
        """Test PUT /api/teachers/{id} - update a teacher"""
        # First create a teacher
        test_teacher = {
            "name": "TEST_Update Original",
            "title": "Original Title"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/teachers",
            json=test_teacher,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        created = create_response.json()
        teacher_id = created["id"]
        created_teacher_ids.append(teacher_id)
        
        # Update the teacher
        update_data = {
            "name": "TEST_Update Modified",
            "title": "Modified Title",
            "bio": "Updated bio content",
            "isActive": False
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/teachers/{teacher_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        result = update_response.json()
        assert result.get("success") == True or "message" in result
        print(f"✓ PUT /api/teachers/{teacher_id} successful")
        
        # Verify update persisted
        get_response = requests.get(f"{BASE_URL}/api/teachers")
        teachers = get_response.json()
        updated_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
        
        assert updated_teacher is not None
        assert updated_teacher["name"] == update_data["name"]
        assert updated_teacher["title"] == update_data["title"]
        assert updated_teacher["bio"] == update_data["bio"]
        assert updated_teacher["isActive"] == False
        
        print(f"✓ Update persistence verified")
    
    def test_update_nonexistent_teacher(self):
        """Test PUT /api/teachers/{id} with non-existent ID returns 404"""
        fake_id = str(uuid.uuid4())
        update_data = {"name": "TEST_Nonexistent"}
        
        response = requests.put(
            f"{BASE_URL}/api/teachers/{fake_id}",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 404, f"Expected 404 for non-existent teacher, got {response.status_code}"
        print(f"✓ Non-existent teacher update returns 404")


class TestTeachersAPIDelete:
    """Teacher deletion tests"""
    
    def test_delete_teacher(self):
        """Test DELETE /api/teachers/{id}"""
        # First create a teacher
        test_teacher = {
            "name": "TEST_Delete Me",
            "title": "To Be Deleted"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/teachers",
            json=test_teacher,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        teacher_id = create_response.json()["id"]
        
        # Delete the teacher
        delete_response = requests.delete(f"{BASE_URL}/api/teachers/{teacher_id}")
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        
        result = delete_response.json()
        assert result.get("success") == True or "message" in result
        print(f"✓ DELETE /api/teachers/{teacher_id} successful")
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/teachers")
        teachers = get_response.json()
        deleted_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
        
        assert deleted_teacher is None, f"Teacher {teacher_id} should not exist after deletion"
        print(f"✓ Deletion verified - teacher no longer in list")
    
    def test_delete_nonexistent_teacher(self):
        """Test DELETE /api/teachers/{id} with non-existent ID returns 404"""
        fake_id = str(uuid.uuid4())
        
        response = requests.delete(f"{BASE_URL}/api/teachers/{fake_id}")
        assert response.status_code == 404, f"Expected 404 for non-existent teacher, got {response.status_code}"
        print(f"✓ Non-existent teacher delete returns 404")


class TestDashboardStats:
    """Dashboard stats tests including totalTeachers count"""
    
    def test_dashboard_stats_includes_teachers_count(self):
        """Test GET /api/dashboard/stats includes totalTeachers"""
        response = requests.get(f"{BASE_URL}/api/dashboard/stats")
        assert response.status_code == 200
        
        stats = response.json()
        assert "totalTeachers" in stats, "Dashboard stats should include totalTeachers"
        assert isinstance(stats["totalTeachers"], int)
        assert stats["totalTeachers"] >= 0
        
        print(f"✓ Dashboard stats includes totalTeachers: {stats['totalTeachers']}")
        print(f"  Full stats: totalContents={stats.get('totalContents')}, unreadMessages={stats.get('unreadMessages')}, totalViews={stats.get('totalViews')}")


class TestAdminLogin:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test POST /api/admin/login with correct credentials"""
        credentials = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json=credentials,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Admin login successful with admin/admin123")
    
    def test_admin_login_failure(self):
        """Test POST /api/admin/login with wrong credentials"""
        credentials = {
            "username": "admin",
            "password": "wrongpassword"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json=credentials,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 401, f"Expected 401 for wrong password, got {response.status_code}"
        print(f"✓ Admin login correctly rejects wrong credentials")


# Cleanup fixture - runs after all tests
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_data():
    """Cleanup TEST_ prefixed teachers after all tests complete"""
    yield
    # Cleanup
    print("\n--- Cleaning up test data ---")
    for teacher_id in created_teacher_ids:
        try:
            requests.delete(f"{BASE_URL}/api/teachers/{teacher_id}")
            print(f"  Cleaned up teacher: {teacher_id}")
        except:
            pass
    
    # Also clean up any TEST_ teachers that might have been left from previous runs
    try:
        response = requests.get(f"{BASE_URL}/api/teachers")
        if response.status_code == 200:
            teachers = response.json()
            for teacher in teachers:
                if teacher.get("name", "").startswith("TEST_"):
                    requests.delete(f"{BASE_URL}/api/teachers/{teacher['id']}")
                    print(f"  Cleaned up leftover test teacher: {teacher['id']}")
    except:
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
