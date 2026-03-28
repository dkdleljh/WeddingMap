"""예식장 비교함 생성과 조회를 담당하는 API입니다."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ComparisonSet, ComparisonSetItem, Venue

router = APIRouter()


class ComparisonCreateRequest(BaseModel):
    """비교함 생성 시 필요한 입력값입니다."""

    user_id: int = 1
    title: str = Field(default="기본 비교함", min_length=1, max_length=150)
    venue_ids: list[int] = Field(default_factory=list, max_length=5)


def _serialize_comparison_item(venue: Venue) -> dict:
    """비교 테이블에 바로 연결할 수 있는 예식장 요약 정보입니다."""

    return {
        "venue_id": venue.id,
        "name": venue.name,
        "region": f"{venue.region.sido} {venue.region.sigungu}" if venue.region else "",
        "address": venue.address,
        "meal_price_min": venue.meal_price_min,
        "meal_price_max": venue.meal_price_max,
        "rental_fee_min": venue.rental_fee_min,
        "rental_fee_max": venue.rental_fee_max,
        "warranty_guest_min": venue.warranty_guest_min,
        "warranty_guest_max": venue.warranty_guest_max,
        "parking": venue.parking[0].parking_slots if venue.parking else None,
        "overall_score": venue.overall_score,
        "trust_grade": venue.trust_grade,
        "review_rating": venue.review_rating,
        "review_count": venue.review_count,
        "mood_tags": venue.mood_tags or [],
    }


@router.get("/{comparison_set_id}")
def get_comparison_set(comparison_set_id: int, db: Session = Depends(get_db)):
    items = db.execute(
        select(ComparisonSetItem, Venue)
        .join(Venue, ComparisonSetItem.venue_id == Venue.id)
        .where(ComparisonSetItem.comparison_set_id == comparison_set_id)
    ).all()
    return {
        "success": True,
        "data": {
            "comparison_set_id": comparison_set_id,
            "items": [_serialize_comparison_item(venue) for _, venue in items],
        },
    }


@router.get("")
def get_default_comparison_set(user_id: int = 1, db: Session = Depends(get_db)):
    """사용자 기준 대표 비교함을 쉽게 읽을 수 있도록 루트 경로를 제공합니다."""

    comparison_set = db.scalar(select(ComparisonSet).where(ComparisonSet.user_id == user_id).order_by(ComparisonSet.id.asc()))
    if not comparison_set:
        return {"success": True, "data": {"comparison_set_id": None, "items": []}}
    return get_comparison_set(comparison_set_id=comparison_set.id, db=db)


@router.post("")
def create_comparison_set(payload: ComparisonCreateRequest, db: Session = Depends(get_db)):
    """비교함과 초기 예식장 묶음을 한 번에 생성합니다."""

    comparison_set = ComparisonSet(user_id=payload.user_id, title=payload.title)
    db.add(comparison_set)
    db.flush()
    for venue_id in payload.venue_ids[:5]:
        db.add(ComparisonSetItem(comparison_set_id=comparison_set.id, venue_id=venue_id))
    db.commit()
    db.refresh(comparison_set)
    return {"success": True, "data": {"comparison_set_id": comparison_set.id}}


@router.post("/{comparison_set_id}/items")
def add_comparison_item(comparison_set_id: int, venue_id: int, db: Session = Depends(get_db)):
    count = len(db.scalars(select(ComparisonSetItem).where(ComparisonSetItem.comparison_set_id == comparison_set_id)).all())
    if count >= 5:
        raise HTTPException(status_code=400, detail="비교함은 최대 5개까지 담을 수 있습니다")
    item = ComparisonSetItem(comparison_set_id=comparison_set_id, venue_id=venue_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"success": True, "data": {"item_id": item.id}}
