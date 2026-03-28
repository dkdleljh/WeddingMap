"""문의 목록과 접수를 담당하는 API입니다."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Inquiry

router = APIRouter()


class InquiryRequest(BaseModel):
    user_id: int | None = None
    venue_id: int | None = None
    name: str
    phone: str
    email: EmailStr | None = None
    message: str
    preferred_contact_time: str | None = None


@router.get("")
def list_inquiries(user_id: int | None = None, db: Session = Depends(get_db)):
    """사용자 기준 문의 목록과 전체 운영 목록을 모두 지원합니다."""

    query = select(Inquiry).order_by(Inquiry.created_at.desc())
    if user_id is not None:
        query = query.where(Inquiry.user_id == user_id)
    items = db.scalars(query).all()
    return {
        "success": True,
        "data": [
            {
                "id": item.id,
                "name": item.name,
                "phone": item.phone,
                "email": item.email,
                "message": item.message,
                "preferred_contact_time": item.preferred_contact_time,
                "status": item.status.value,
                "venue_id": item.venue_id,
                "created_at": item.created_at.isoformat(),
            }
            for item in items
        ],
    }


@router.post("")
def create_inquiry(payload: InquiryRequest, db: Session = Depends(get_db)):
    inquiry = Inquiry(**payload.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return {
        "success": True,
        "message": "문의가 접수되었습니다",
        "data": {
            "id": inquiry.id,
            "status": inquiry.status.value,
            "message": inquiry.message,
        },
    }
