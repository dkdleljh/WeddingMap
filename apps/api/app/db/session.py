"""데이터베이스 엔진과 세션 생성을 담당하는 모듈입니다."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine_options: dict[str, object] = {"pool_pre_ping": True}
if settings.database_url.startswith("sqlite"):
    # SQLite는 단일 파일 기반이므로 스레드 체크 옵션을 완화해야 개발 서버에서 편하게 쓸 수 있습니다.
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.database_url, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    """FastAPI 의존성 주입에서 사용할 세션 범위를 제공합니다."""

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
