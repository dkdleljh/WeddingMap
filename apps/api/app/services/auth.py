"""회원가입과 로그인 흐름을 담당하는 인증 서비스입니다."""

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_token, hash_password, verify_password
from app.models.entities import AdminUser, User, UserRole
from app.schemas.auth import RegisterRequest, TokenResponse


def login_user(db: Session, email: str, password: str, is_admin: bool) -> TokenResponse:
    """일반 사용자와 관리자 로그인을 하나의 진입점에서 처리합니다."""

    model = AdminUser if is_admin else User
    account = db.scalar(select(model).where(model.email == email))
    if not account or not verify_password(password, account.password_hash):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다")

    role = "admin" if is_admin else account.role.value
    return TokenResponse(
        access_token=create_token(str(account.id), role, 60),
        refresh_token=create_token(str(account.id), role, 60 * 24 * 7),
        role=role,
    )


def register_user(db: Session, payload: RegisterRequest) -> TokenResponse:
    """중복 이메일을 막고 신규 사용자 계정을 생성합니다."""

    exists = db.scalar(select(User).where(User.email == payload.email))
    if exists:
        raise HTTPException(status_code=409, detail="이미 가입된 이메일입니다")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        nickname=payload.nickname,
        role=UserRole.USER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(
        access_token=create_token(str(user.id), user.role.value, 60),
        refresh_token=create_token(str(user.id), user.role.value, 60 * 24 * 7),
        role=user.role.value,
    )
