"""인증과 비밀번호 보안을 담당하는 공통 유틸 모음입니다."""

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.entities import AdminUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """사용자 비밀번호를 안전한 해시 문자열로 바꿉니다."""

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 저장된 해시가 일치하는지 확인합니다."""

    return pwd_context.verify(plain_password, hashed_password)


def create_token(subject: str, role: str, expires_minutes: int) -> str:
    """액세스 토큰과 리프레시 토큰 생성에 공통으로 사용하는 JWT 발급 함수입니다."""

    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    """서명과 만료 시간을 검증한 뒤 JWT 페이로드를 돌려줍니다."""

    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않거나 만료된 토큰입니다",
        ) from exc


def require_admin(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> AdminUser:
    """관리자 전용 API에서 현재 로그인한 관리자 계정을 확인합니다."""

    if not settings.admin_auth_enabled:
        admin = db.scalar(select(AdminUser).where(AdminUser.is_active.is_(True)).order_by(AdminUser.id.asc()))
        if not admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="활성 관리자 계정이 없습니다")
        return admin

    token = credentials.credentials if credentials and credentials.scheme.lower() == "bearer" else None
    if token is None:
        token = request.cookies.get(settings.admin_session_cookie_name)

    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="관리자 인증 토큰이 필요합니다")

    payload = decode_token(token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="관리자 권한이 필요합니다")

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="토큰에 사용자 식별자가 없습니다")

    admin = db.get(AdminUser, int(subject))
    if not admin or not admin.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="사용할 수 없는 관리자 계정입니다")
    return admin
