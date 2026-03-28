from app.db.run_migrations import migrate
from app.db.seed import seed
from app.main import app

from fastapi.testclient import TestClient


def test_admin_api_requires_token():
    migrate()
    seed()
    client = TestClient(app)

    response = client.get("/api/admin/dashboard")

    assert response.status_code == 401


def test_admin_login_and_audit_log_flow():
    migrate()
    seed()
    client = TestClient(app)

    login_response = client.post(
        "/api/auth/admin/login",
        json={"email": "admin@weddingmap.kr", "password": "AdminPassw0rd!"},
    )
    assert login_response.status_code == 200
    token = login_response.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_response = client.patch(
        "/api/admin/venues/1",
        json={"trust_grade": "A", "is_active": True},
        headers=headers,
    )
    assert update_response.status_code == 200

    audit_response = client.get("/api/admin/audit-logs", headers=headers)
    assert audit_response.status_code == 200
    assert len(audit_response.json()["data"]) >= 1


def test_admin_cookie_session_and_logout_flow():
    migrate()
    seed()
    client = TestClient(app)

    login_response = client.post(
        "/api/auth/admin/login",
        json={"email": "admin@weddingmap.kr", "password": "AdminPassw0rd!"},
    )
    assert login_response.status_code == 200

    session_response = client.get("/api/auth/admin/session")
    assert session_response.status_code == 200
    assert session_response.json()["data"]["email"] == "admin@weddingmap.kr"

    protected_response = client.get("/api/admin/dashboard")
    assert protected_response.status_code == 200

    logout_response = client.post("/api/auth/admin/logout")
    assert logout_response.status_code == 200

    session_after_logout = client.get("/api/auth/admin/session")
    assert session_after_logout.status_code == 401
