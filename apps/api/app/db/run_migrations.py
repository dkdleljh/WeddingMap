"""개발 환경과 운영 환경에서 각각 맞는 방식으로 스키마를 준비하는 모듈입니다."""

from pathlib import Path

from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models import entities  # noqa: F401

migration_dir = Path(__file__).resolve().parents[4] / "database" / "migrations"


def migrate() -> None:
    """현재 데이터베이스 엔진에 맞는 방식으로 스키마를 준비합니다."""

    if str(engine.url).startswith("sqlite"):
        # SQLite 개발 모드는 ORM 메타데이터 기준으로 빠르게 스키마를 만듭니다.
        Base.metadata.create_all(bind=engine)
        print("SQLite 개발 스키마 생성 완료")
        return

    # 운영형 데이터베이스는 명시적 SQL 마이그레이션 파일을 순서대로 적용합니다.
    with engine.begin() as connection:
        for path in sorted(migration_dir.glob("*.sql")):
            connection.execute(text(path.read_text(encoding="utf-8")))
            print(f"적용 완료: {path.name}")


migrate()
