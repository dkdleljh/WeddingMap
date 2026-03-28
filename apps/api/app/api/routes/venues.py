from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.entities import Region, Venue

router = APIRouter()


@router.get("")
def list_venues(
    sido: str | None = None,
    sigungu: str | None = None,
    keyword: str | None = None,
    public_only: bool = False,
    hall_type: str | None = None,
    can_outdoor: bool | None = None,
    is_single_hall: bool | None = None,
    meal_price_lte: int | None = None,
    rental_fee_lte: int | None = None,
    sort: str = Query(default="score"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query: Select[tuple[Venue]] = select(Venue).options(joinedload(Venue.region))
    if sido or sigungu:
        query = query.join(Region, Venue.region_id == Region.id)
    if sido:
        query = query.where(Region.sido == sido)
    if sigungu:
        query = query.where(Region.sigungu == sigungu)
    if keyword:
        query = query.where(or_(Venue.name.ilike(f"%{keyword}%"), Venue.address.ilike(f"%{keyword}%")))
    if public_only:
        query = query.where(Venue.is_public_hall.is_(True))
    if hall_type:
        query = query.where(Venue.hall_type == hall_type)
    if can_outdoor is not None:
        query = query.where(Venue.can_outdoor.is_(can_outdoor))
    if is_single_hall is not None:
        query = query.where(Venue.is_single_hall.is_(is_single_hall))
    if meal_price_lte is not None:
        query = query.where(Venue.meal_price_min <= meal_price_lte)
    if rental_fee_lte is not None:
        query = query.where(Venue.rental_fee_min <= rental_fee_lte)

    if sort == "meal_price":
        query = query.order_by(Venue.meal_price_min.asc(), Venue.overall_score.desc())
    elif sort == "reviews":
        query = query.order_by(Venue.review_count.desc(), Venue.review_rating.desc())
    else:
        query = query.order_by(Venue.overall_score.desc(), Venue.review_count.desc())

    total = len(db.scalars(query).unique().all())
    rows = db.scalars(query.offset((page - 1) * page_size).limit(page_size)).unique().all()
    return {
        "success": True,
        "data": {
            "items": [
                {
                    "id": venue.id,
                    "name": venue.name,
                    "slug": venue.slug,
                    "address": venue.address,
                    "region": f"{venue.region.sido} {venue.region.sigungu}",
                    "meal_price_min": venue.meal_price_min,
                    "meal_price_max": venue.meal_price_max,
                    "rental_fee_min": venue.rental_fee_min,
                    "rental_fee_max": venue.rental_fee_max,
                    "trust_grade": venue.trust_grade,
                    "overall_score": venue.overall_score,
                    "review_rating": venue.review_rating,
                    "review_count": venue.review_count,
                    "is_public_hall": venue.is_public_hall,
                    "mood_tags": venue.mood_tags or [],
                }
                for venue in rows
            ],
            "pagination": {"page": page, "page_size": page_size, "total": total},
        },
    }


@router.get("/{venue_id}")
def get_venue_detail(venue_id: int, db: Session = Depends(get_db)):
    venue = db.scalar(
        select(Venue)
        .options(
            joinedload(Venue.region),
            joinedload(Venue.halls),
            joinedload(Venue.pricings),
            joinedload(Venue.meals),
            joinedload(Venue.parking),
            joinedload(Venue.access),
            joinedload(Venue.policies),
            joinedload(Venue.photos),
            joinedload(Venue.reviews),
        )
        .where(Venue.id == venue_id)
    )
    if not venue:
        raise HTTPException(status_code=404, detail="예식장을 찾을 수 없습니다")

    return {
        "success": True,
        "data": {
            "id": venue.id,
            "name": venue.name,
            "slug": venue.slug,
            "region": {"sido": venue.region.sido, "sigungu": venue.region.sigungu},
            "address": venue.address,
            "description": venue.description,
            "trust_grade": venue.trust_grade,
            "last_verified_at": venue.last_verified_at.isoformat() if venue.last_verified_at else None,
            "photos": [{"id": photo.id, "url": photo.image_url, "category": photo.category} for photo in venue.photos],
            "halls": [{"name": hall.name, "hall_type": hall.hall_type, "capacity_min": hall.capacity_min, "capacity_max": hall.capacity_max} for hall in venue.halls],
            "pricing": [{"item_name": item.item_name, "price_min": item.price_min, "price_max": item.price_max} for item in venue.pricings],
            "meals": [{"meal_type": meal.meal_type, "price_per_person": meal.price_per_person, "is_buffet": meal.is_buffet} for meal in venue.meals],
            "parking": [{"parking_slots": parking.parking_slots, "free_minutes": parking.free_minutes, "valet_available": parking.valet_available} for parking in venue.parking],
            "access": [{"subway_line": access.subway_line, "subway_minutes": access.subway_minutes, "bus_stop_name": access.bus_stop_name, "bus_minutes": access.bus_minutes} for access in venue.access],
            "policies": [{"policy_type": policy.policy_type, "content": policy.content, "flexibility_score": policy.flexibility_score} for policy in venue.policies],
            "reviews": [
                {
                    "id": review.id,
                    "title": review.title,
                    "content": review.content,
                    "review_type": review.review_type.value,
                    "rating_overall": review.rating_overall,
                    "status": review.status.value,
                    "is_verified": review.is_verified,
                }
                for review in venue.reviews
            ],
        },
    }
