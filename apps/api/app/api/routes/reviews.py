"""리뷰 목록과 등록을 담당하는 API입니다."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Review, ReviewStatus, ReviewType, Venue
from app.schemas.review import ReviewCreateRequest

router = APIRouter()


def _serialize_review(item: Review) -> dict:
    """사용자 앱과 관리자 앱이 함께 쓸 수 있는 리뷰 형태로 직렬화합니다."""

    return {
        "id": item.id,
        "venue_id": item.venue_id,
        "title": item.title,
        "content": item.content,
        "review_type": item.review_type.value,
        "rating_overall": item.rating_overall,
        "status": item.status.value,
        "is_verified": item.is_verified,
        "created_at": item.created_at.isoformat(),
    }


@router.get("")
def list_reviews(venue_id: int | None = None, db: Session = Depends(get_db)):
    query = select(Review).order_by(Review.created_at.desc())
    if venue_id:
        query = query.where(Review.venue_id == venue_id)
    items = db.scalars(query).all()
    return {"success": True, "data": [_serialize_review(item) for item in items]}


@router.post("")
def create_review(payload: ReviewCreateRequest, db: Session = Depends(get_db)):
    overall = round((payload.rating_food + payload.rating_access + payload.rating_parking + payload.rating_mood + payload.rating_contract) / 5, 2)
    review = Review(
        venue_id=payload.venue_id,
        user_id=1,
        review_type=ReviewType(payload.review_type),
        title=payload.title,
        content=payload.content,
        rating_overall=overall,
        rating_food=payload.rating_food,
        rating_access=payload.rating_access,
        rating_parking=payload.rating_parking,
        rating_mood=payload.rating_mood,
        rating_contract=payload.rating_contract,
        status=ReviewStatus.PENDING,
    )
    db.add(review)

    venue = db.get(Venue, payload.venue_id)
    if venue:
        venue.review_count += 1
        venue.review_rating = round(((venue.review_rating * max(venue.review_count - 1, 0)) + overall) / max(venue.review_count, 1), 2)
    db.commit()
    db.refresh(review)
    return {"success": True, "message": "리뷰가 등록되었습니다", "data": _serialize_review(review)}
