"""찜 목록 조회와 추가를 담당하는 API입니다."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Bookmark, Venue

router = APIRouter()


def _serialize_bookmark(bookmark: Bookmark, venue: Venue) -> dict:
    """사용자 웹앱에서 바로 쓸 수 있도록 찜 항목을 직렬화합니다."""

    return {
        "bookmark_id": bookmark.id,
        "venue_id": venue.id,
        "venue_name": venue.name,
        "slug": venue.slug,
        "address": venue.address,
        "region": f"{venue.region.sido} {venue.region.sigungu}" if venue.region else "",
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


@router.get("")
def list_bookmarks(user_id: int = 1, db: Session = Depends(get_db)):
    """문서 기준 루트 경로에서도 찜 목록을 조회할 수 있게 합니다."""

    rows = db.execute(select(Bookmark, Venue).join(Venue, Bookmark.venue_id == Venue.id).where(Bookmark.user_id == user_id)).all()
    return {"success": True, "data": [_serialize_bookmark(bookmark, venue) for bookmark, venue in rows]}


@router.get("/{user_id}")
def list_bookmarks_by_user(user_id: int, db: Session = Depends(get_db)):
    """기존 경로와의 호환성을 유지하는 별칭입니다."""

    return list_bookmarks(user_id=user_id, db=db)


@router.post("")
def create_bookmark(user_id: int, venue_id: int, db: Session = Depends(get_db)):
    """쿼리 파라미터 기반의 기존 찜 추가 경로를 유지합니다."""

    exists = db.scalar(select(Bookmark).where(Bookmark.user_id == user_id, Bookmark.venue_id == venue_id))
    if exists:
        return {"success": True, "message": "이미 찜한 예식장입니다", "data": {"bookmark_id": exists.id}}
    bookmark = Bookmark(user_id=user_id, venue_id=venue_id)
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return {"success": True, "message": "찜이 추가되었습니다", "data": {"bookmark_id": bookmark.id}}


@router.post("/{venue_id}")
def create_bookmark_by_path(venue_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    """문서 기준 경로에서도 같은 동작을 수행할 수 있게 합니다."""

    return create_bookmark(user_id=user_id, venue_id=venue_id, db=db)
