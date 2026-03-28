from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import require_admin
from app.db.session import get_db
from app.models.entities import AdminUser
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth import login_user, register_user

router = APIRouter()


def _set_admin_session_cookie(response: Response, access_token: str) -> None:
    """관리자 앱이 액세스 토큰을 직접 저장하지 않아도 되도록 httpOnly 쿠키를 설정합니다."""

    response.set_cookie(
        key=settings.admin_session_cookie_name,
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )


def _clear_admin_session_cookie(response: Response) -> None:
    """관리자 로그아웃 시 세션 쿠키를 즉시 삭제합니다."""

    response.delete_cookie(key=settings.admin_session_cookie_name, path="/")


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, payload.email, payload.password, payload.is_admin)
    return {"success": True, "data": token.model_dump()}


@router.post("/admin/login")
def admin_login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """관리자 앱이 별도 진입점을 쓸 수 있도록 관리자 전용 로그인 경로를 제공합니다."""

    token = login_user(db, payload.email, payload.password, True)
    _set_admin_session_cookie(response, token.access_token)
    return {"success": True, "data": token.model_dump()}


@router.get("/admin/session")
def admin_session(current_admin: AdminUser = Depends(require_admin)):
    """관리자 앱이 현재 세션 유효 여부를 가볍게 확인할 수 있게 합니다."""

    return {
        "success": True,
        "data": {
            "id": current_admin.id,
            "email": current_admin.email,
            "name": current_admin.name,
            "role": "admin",
        },
    }


@router.post("/admin/logout")
def admin_logout(response: Response):
    """관리자 세션 쿠키를 제거해 즉시 로그아웃합니다."""

    _clear_admin_session_cookie(response)
    return {"success": True, "message": "관리자 로그아웃이 완료되었습니다"}


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    token = register_user(db, payload)
    return {"success": True, "data": token.model_dump(), "message": "회원가입이 완료되었습니다"}
