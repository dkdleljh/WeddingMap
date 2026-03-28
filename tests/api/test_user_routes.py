from app.db.run_migrations import migrate
from app.db.seed import seed
from app.main import app

from fastapi.testclient import TestClient


def test_bookmarks_and_user_profile_routes():
    migrate()
    seed()
    client = TestClient(app)

    bookmarks_response = client.get("/api/bookmarks", params={"user_id": 1})
    assert bookmarks_response.status_code == 200
    assert len(bookmarks_response.json()["data"]) >= 1

    profile_response = client.get("/api/users/me", params={"user_id": 1})
    assert profile_response.status_code == 200
    assert profile_response.json()["data"]["email"] == "demo@weddingmap.kr"


def test_comparison_and_budget_alias_routes():
    migrate()
    seed()
    client = TestClient(app)

    comparison_response = client.get("/api/comparisons", params={"user_id": 1})
    assert comparison_response.status_code == 200
    assert len(comparison_response.json()["data"]["items"]) >= 1

    budget_response = client.post(
        "/api/budget/calculate",
        json={
            "expected_guest_count": 220,
            "meal_guest_count": 220,
            "preferred_region": "서울",
            "preferred_style": "호텔",
            "total_budget": 30000000,
            "include_rental_fee": True,
            "include_flower_decor": True,
            "include_extra_options": True,
        },
    )
    assert budget_response.status_code == 200
    assert budget_response.json()["data"]["expected_total_max"] >= budget_response.json()["data"]["expected_total_min"]


def test_review_and_inquiry_creation_routes():
    migrate()
    seed()
    client = TestClient(app)

    review_response = client.post(
        "/api/reviews",
        json={
            "venue_id": 1,
            "review_type": "visit",
            "title": "통합 테스트 리뷰",
            "content": "리뷰 등록 흐름을 검증합니다.",
            "rating_food": 5,
            "rating_access": 4,
            "rating_parking": 4,
            "rating_mood": 5,
            "rating_contract": 4,
        },
    )
    assert review_response.status_code == 200
    assert review_response.json()["data"]["status"] == "pending"

    inquiry_response = client.post(
        "/api/inquiries",
        json={
            "user_id": 1,
            "venue_id": 1,
            "name": "테스트 사용자",
            "phone": "010-0000-0000",
            "email": "demo@weddingmap.kr",
            "message": "상담 문의 통합 테스트입니다.",
            "preferred_contact_time": "저녁",
        },
    )
    assert inquiry_response.status_code == 200
    assert inquiry_response.json()["data"]["status"] == "received"
