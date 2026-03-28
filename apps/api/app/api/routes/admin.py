"""관리자 화면에서 사용하는 운영 API 모음입니다."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.entities import (
    AdminUser,
    AuditLog,
    DataIngestionLog,
    Inquiry,
    InquiryStatus,
    Region,
    Review,
    ReviewStatus,
    Venue,
    VenuePricing,
    utc_now,
)

router = APIRouter()


def _serialize_venue(item: Venue) -> dict:
    """관리자 예식장 목록과 상세 화면에 필요한 필드만 골라 직렬화합니다."""

    return {
        "id": item.id,
        "region_id": item.region_id,
        "name": item.name,
        "slug": item.slug,
        "address": item.address,
        "road_address": item.road_address,
        "description": item.description,
        "phone": item.phone,
        "homepage_url": item.homepage_url,
        "hall_type": item.hall_type,
        "trust_grade": item.trust_grade,
        "source_type": item.source_type,
        "is_active": item.is_active,
        "is_public_hall": item.is_public_hall,
        "is_single_hall": item.is_single_hall,
        "is_simultaneous_ceremony": item.is_simultaneous_ceremony,
        "can_outdoor": item.can_outdoor,
        "rental_fee_min": item.rental_fee_min,
        "rental_fee_max": item.rental_fee_max,
        "meal_price_min": item.meal_price_min,
        "meal_price_max": item.meal_price_max,
        "warranty_guest_min": item.warranty_guest_min,
        "warranty_guest_max": item.warranty_guest_max,
        "overall_score": item.overall_score,
        "review_rating": item.review_rating,
        "review_count": item.review_count,
        "last_verified_at": item.last_verified_at.isoformat() if item.last_verified_at else None,
        "region_name": f"{item.region.sido} {item.region.sigungu}" if item.region else "",
    }


def _serialize_pricing(item: VenuePricing) -> dict:
    """가격 관리 화면에 맞는 형태로 직렬화합니다."""

    return {
        "id": item.id,
        "venue_id": item.venue_id,
        "venue_name": item.venue.name if item.venue else "",
        "item_name": item.item_name,
        "price_min": item.price_min,
        "price_max": item.price_max,
        "unit": item.unit,
        "notes": item.notes,
    }


def _serialize_review(item: Review) -> dict:
    """리뷰 검수 화면에 맞는 형태로 직렬화합니다."""

    return {
        "id": item.id,
        "venue_id": item.venue_id,
        "venue_name": item.venue.name if item.venue else "",
        "title": item.title,
        "content": item.content,
        "review_type": item.review_type.value,
        "rating_overall": item.rating_overall,
        "is_verified": item.is_verified,
        "status": item.status.value,
        "created_at": item.created_at.isoformat(),
    }


def _serialize_inquiry(item: Inquiry) -> dict:
    """문의 관리 화면에 맞는 형태로 직렬화합니다."""

    return {
        "id": item.id,
        "venue_id": item.venue_id,
        "venue_name": item.venue.name if getattr(item, "venue", None) else "",
        "name": item.name,
        "phone": item.phone,
        "email": item.email,
        "message": item.message,
        "preferred_contact_time": item.preferred_contact_time,
        "status": item.status.value,
        "created_at": item.created_at.isoformat(),
    }


def _serialize_audit_log(item: AuditLog) -> dict:
    """감사 로그 화면에 필요한 필드만 정리합니다."""

    return {
        "id": item.id,
        "actor_type": item.actor_type,
        "actor_id": item.actor_id,
        "action": item.action,
        "target_type": item.target_type,
        "target_id": item.target_id,
        "metadata_json": item.metadata_json,
        "created_at": item.created_at.isoformat(),
    }


def _append_audit_log(db: Session, admin_user: AdminUser, action: str, target_type: str, target_id: int, metadata_json: dict | None = None) -> None:
    """운영 변경 이력을 남겨 향후 관리자 감사 로그 화면으로 연결할 수 있게 합니다."""

    db.add(
        AuditLog(
            actor_type="admin",
            actor_id=admin_user.id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            metadata_json=metadata_json,
            created_at=utc_now(),
        )
    )


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """운영 대시보드 KPI와 최근 상태를 반환합니다."""

    total_venues = db.scalar(select(func.count(Venue.id))) or 0
    active_venues = db.scalar(select(func.count(Venue.id)).where(Venue.is_active.is_(True))) or 0
    pending_reviews = db.scalar(select(func.count(Review.id)).where(Review.status == ReviewStatus.PENDING)) or 0
    pending_inquiries = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.status == InquiryStatus.RECEIVED)) or 0
    region_counts = db.execute(
        select(Region.sido, func.count(Venue.id)).join(Venue, Venue.region_id == Region.id).group_by(Region.sido).order_by(func.count(Venue.id).desc())
    ).all()
    latest_ingestions = db.scalars(select(DataIngestionLog).order_by(DataIngestionLog.started_at.desc()).limit(5)).all()
    return {
        "success": True,
        "data": {
            "kpi": {
                "등록 예식장 수": total_venues,
                "운영 중 예식장 수": active_venues,
                "미검수 리뷰 수": pending_reviews,
                "문의 대기 건수": pending_inquiries,
            },
            "지역별 예식장 수": [{"sido": sido, "count": count} for sido, count in region_counts],
            "최근 수집 로그": [{"source_name": item.source_name, "status": item.status.value, "success_count": item.success_count, "failure_count": item.failure_count} for item in latest_ingestions],
        },
    }


@router.get("/venues")
def admin_venues(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """관리자용 예식장 목록을 반환합니다."""

    items = db.scalars(select(Venue).order_by(Venue.id.desc())).all()
    return {"success": True, "data": [_serialize_venue(item) for item in items]}


@router.get("/venues/{venue_id}")
def admin_venue_detail(venue_id: int, db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """예식장 단건 상세를 반환합니다."""

    item = db.get(Venue, venue_id)
    if not item:
        raise HTTPException(status_code=404, detail="예식장을 찾을 수 없습니다")
    return {"success": True, "data": _serialize_venue(item)}


@router.patch("/venues/{venue_id}")
def update_admin_venue(venue_id: int, payload: dict, db: Session = Depends(get_db), current_admin: AdminUser = Depends(require_admin)):
    """운영자가 자주 수정하는 예식장 기본 정보를 갱신합니다."""

    item = db.get(Venue, venue_id)
    if not item:
        raise HTTPException(status_code=404, detail="예식장을 찾을 수 없습니다")

    allowed_fields = {
        "name",
        "address",
        "road_address",
        "description",
        "phone",
        "homepage_url",
        "hall_type",
        "trust_grade",
        "source_type",
        "is_active",
        "is_public_hall",
        "is_single_hall",
        "is_simultaneous_ceremony",
        "can_outdoor",
        "rental_fee_min",
        "rental_fee_max",
        "meal_price_min",
        "meal_price_max",
        "warranty_guest_min",
        "warranty_guest_max",
    }
    updated_fields: dict[str, object] = {}
    for key, value in payload.items():
        if key in allowed_fields:
            setattr(item, key, value)
            updated_fields[key] = value
    item.last_verified_at = utc_now()
    _append_audit_log(db, current_admin, "venue_update", "venue", item.id, updated_fields)
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "예식장 정보가 저장되었습니다", "data": _serialize_venue(item)}


@router.get("/pricings")
def admin_pricings(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """가격 관리 화면에 필요한 모든 가격 항목을 반환합니다."""

    items = db.scalars(select(VenuePricing).order_by(VenuePricing.id.desc())).all()
    return {"success": True, "data": [_serialize_pricing(item) for item in items]}


@router.patch("/pricings/{pricing_id}")
def update_admin_pricing(pricing_id: int, payload: dict, db: Session = Depends(get_db), current_admin: AdminUser = Depends(require_admin)):
    """대관료나 옵션 비용 같은 가격 항목을 갱신합니다."""

    item = db.get(VenuePricing, pricing_id)
    if not item:
        raise HTTPException(status_code=404, detail="가격 정보를 찾을 수 없습니다")
    allowed_fields = {"item_name", "price_min", "price_max", "unit", "notes"}
    updated_fields: dict[str, object] = {}
    for key, value in payload.items():
        if key in allowed_fields:
            setattr(item, key, value)
            updated_fields[key] = value
    _append_audit_log(db, current_admin, "pricing_update", "venue_pricing", item.id, updated_fields)
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "가격 정보가 저장되었습니다", "data": _serialize_pricing(item)}


@router.get("/reviews")
def admin_reviews(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """관리자용 리뷰 목록을 반환합니다."""

    items = db.scalars(select(Review).order_by(Review.created_at.desc())).all()
    return {"success": True, "data": [_serialize_review(item) for item in items]}


@router.patch("/reviews/{review_id}/approve")
def approve_review(review_id: int, db: Session = Depends(get_db), current_admin: AdminUser = Depends(require_admin)):
    """리뷰를 승인 상태로 변경합니다."""

    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="리뷰를 찾을 수 없습니다")
    review.status = ReviewStatus.APPROVED
    _append_audit_log(db, current_admin, "review_approve", "review", review.id, {"status": review.status.value})
    db.commit()
    db.refresh(review)
    return {"success": True, "message": "리뷰가 승인되었습니다", "data": _serialize_review(review)}


@router.patch("/reviews/{review_id}/hide")
def hide_review(review_id: int, db: Session = Depends(get_db), current_admin: AdminUser = Depends(require_admin)):
    """리뷰를 숨김 상태로 변경합니다."""

    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="리뷰를 찾을 수 없습니다")
    review.status = ReviewStatus.HIDDEN
    _append_audit_log(db, current_admin, "review_hide", "review", review.id, {"status": review.status.value})
    db.commit()
    db.refresh(review)
    return {"success": True, "message": "리뷰가 숨김 처리되었습니다", "data": _serialize_review(review)}


@router.get("/inquiries")
def admin_inquiries(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """관리자용 문의 목록을 반환합니다."""

    items = db.scalars(select(Inquiry).order_by(Inquiry.created_at.desc())).all()
    return {"success": True, "data": [_serialize_inquiry(item) for item in items]}


@router.patch("/inquiries/{inquiry_id}")
def update_inquiry_status(inquiry_id: int, payload: dict, db: Session = Depends(get_db), current_admin: AdminUser = Depends(require_admin)):
    """문의 진행 상태를 운영 흐름에 맞게 갱신합니다."""

    item = db.get(Inquiry, inquiry_id)
    if not item:
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다")

    status_value = payload.get("status")
    if status_value:
        item.status = InquiryStatus(status_value)
    _append_audit_log(db, current_admin, "inquiry_update", "inquiry", item.id, {"status": item.status.value})
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "문의 상태가 변경되었습니다", "data": _serialize_inquiry(item)}


@router.get("/audit-logs")
def admin_audit_logs(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    """최근 운영 변경 이력을 감사 로그 화면에 제공합니다."""

    items = db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(100)).all()
    return {"success": True, "data": [_serialize_audit_log(item) for item in items]}
