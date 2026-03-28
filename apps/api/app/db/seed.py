"""개발 환경에서 바로 화면과 API를 확인할 수 있도록 샘플 데이터를 적재합니다."""

import json
from pathlib import Path

from sqlalchemy import delete, select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.entities import AdminUser, Bookmark, ComparisonSet, ComparisonSetItem, Inquiry, Region, Review, ReviewStatus, ReviewType, User, UserRole, Venue, VenueAccess, VenueHall, VenueMeal, VenueParking, VenuePhoto, VenuePolicy, VenuePricing, utc_now

sample_path = Path(__file__).resolve().parents[4] / "sample-data" / "venues.json"


def seed() -> None:
    """기존 데이터를 비우고 샘플 예식장, 리뷰, 문의, 계정을 다시 생성합니다."""

    payload = json.loads(sample_path.read_text(encoding="utf-8"))
    db = SessionLocal()
    try:
        db.execute(delete(ComparisonSetItem))
        db.execute(delete(ComparisonSet))
        db.execute(delete(Bookmark))
        db.execute(delete(Inquiry))
        db.execute(delete(Review))
        db.execute(delete(VenuePhoto))
        db.execute(delete(VenuePolicy))
        db.execute(delete(VenueAccess))
        db.execute(delete(VenueParking))
        db.execute(delete(VenueMeal))
        db.execute(delete(VenuePricing))
        db.execute(delete(VenueHall))
        db.execute(delete(Venue))
        db.execute(delete(AdminUser))
        db.execute(delete(User))
        db.execute(delete(Region))
        db.commit()

        region_map: dict[str, Region] = {}
        for item in payload:
            key = f"{item['region']['sido']}::{item['region']['sigungu']}"
            if key not in region_map:
                region = Region(**item["region"])
                db.add(region)
                db.flush()
                region_map[key] = region

        demo_user = User(
            email="demo@weddingmap.kr",
            password_hash=hash_password("Passw0rd!"),
            nickname="데모사용자",
            role=UserRole.USER,
            budget_min=15000000,
            budget_max=35000000,
            expected_guest_count=220,
            preferred_region_id=next(iter(region_map.values())).id,
        )
        admin_user = AdminUser(
            email="admin@weddingmap.kr",
            password_hash=hash_password("AdminPassw0rd!"),
            name="운영관리자",
            role_name="super_admin",
            is_active=True,
        )
        db.add_all([demo_user, admin_user])
        db.flush()

        created_venues: list[Venue] = []
        for item in payload:
            region = region_map[f"{item['region']['sido']}::{item['region']['sigungu']}"]
            venue = Venue(
                region_id=region.id,
                name=item["name"],
                slug=item["slug"],
                address=item["address"],
                road_address=item.get("road_address"),
                latitude=item.get("latitude"),
                longitude=item.get("longitude"),
                phone=item.get("phone"),
                homepage_url=item.get("homepage_url"),
                description=item.get("description"),
                hall_type=item.get("hall_type"),
                mood_tags=item.get("mood_tags"),
                warranty_guest_min=item.get("warranty_guest_min"),
                warranty_guest_max=item.get("warranty_guest_max"),
                meal_price_min=item.get("meal_price_min"),
                meal_price_max=item.get("meal_price_max"),
                rental_fee_min=item.get("rental_fee_min"),
                rental_fee_max=item.get("rental_fee_max"),
                is_public_hall=item.get("is_public_hall", False),
                is_single_hall=item.get("is_single_hall", False),
                is_simultaneous_ceremony=item.get("is_simultaneous_ceremony", False),
                can_outdoor=item.get("can_outdoor", False),
                trust_grade=item.get("trust_grade", "B"),
                review_rating=item.get("review_rating", 0),
                review_count=item.get("review_count", 0),
                overall_score=item.get("overall_score", 0),
                source_type=item.get("source_type", "manual"),
                last_verified_at=utc_now(),
            )
            db.add(venue)
            db.flush()
            created_venues.append(venue)

            for hall in item.get("halls", []):
                db.add(VenueHall(venue_id=venue.id, **hall))
            for pricing in item.get("pricings", []):
                db.add(VenuePricing(venue_id=venue.id, **pricing))
            for meal in item.get("meals", []):
                db.add(VenueMeal(venue_id=venue.id, **meal))
            for parking in item.get("parking", []):
                db.add(VenueParking(venue_id=venue.id, **parking))
            for access in item.get("access", []):
                db.add(VenueAccess(venue_id=venue.id, **access))
            for policy in item.get("policies", []):
                db.add(VenuePolicy(venue_id=venue.id, **policy))
            for photo in item.get("photos", []):
                db.add(VenuePhoto(venue_id=venue.id, **photo))
            for review in item.get("reviews", []):
                db.add(
                    Review(
                        venue_id=venue.id,
                        user_id=demo_user.id,
                        review_type=ReviewType(review["review_type"]),
                        title=review["title"],
                        content=review["content"],
                        rating_overall=review["rating_overall"],
                        rating_food=review["rating_food"],
                        rating_access=review["rating_access"],
                        rating_parking=review["rating_parking"],
                        rating_mood=review["rating_mood"],
                        rating_contract=review["rating_contract"],
                        is_verified=review.get("is_verified", False),
                        status=ReviewStatus(review.get("status", "approved")),
                    )
                )

        comparison = ComparisonSet(user_id=demo_user.id, title="주말 예식 후보")
        db.add(comparison)
        db.flush()
        for venue in created_venues[:3]:
            db.add(ComparisonSetItem(comparison_set_id=comparison.id, venue_id=venue.id))
        for venue in created_venues[:2]:
            db.add(Bookmark(user_id=demo_user.id, venue_id=venue.id))

        db.add(
            Inquiry(
                user_id=demo_user.id,
                venue_id=created_venues[0].id,
                name="김예비",
                phone="010-1234-5678",
                email="demo@weddingmap.kr",
                message="2026년 10월 토요일 점심 예식 가능 여부를 알고 싶습니다.",
                preferred_contact_time="평일 저녁 7시 이후",
            )
        )
        db.commit()
        print("샘플 데이터 적재 완료")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
