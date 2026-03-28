from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import User

router = APIRouter()


def _serialize_user(user: User) -> dict:
    """마이페이지에서 필요한 사용자 정보를 공통 형태로 정리합니다."""

    return {
        "id": user.id,
        "email": user.email,
        "nickname": user.nickname,
        "preferred_region_id": user.preferred_region_id,
        "budget_min": user.budget_min,
        "budget_max": user.budget_max,
        "expected_guest_count": user.expected_guest_count,
    }


@router.get("/me")
def get_me(user_id: int = 1, db: Session = Depends(get_db)):
    """인증 전 개발 흐름에서도 기본 사용자 정보를 읽을 수 있도록 합니다."""

    return get_user(user_id=user_id, db=db)


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    return {"success": True, "data": _serialize_user(user)}
