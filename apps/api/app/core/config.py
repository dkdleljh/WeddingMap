"""환경 변수와 기본 실행 값을 관리하는 설정 모듈입니다."""

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """로컬 개발과 운영 환경에서 공통으로 쓰는 설정 객체입니다."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_", extra="ignore")

    app_name: str = "WeddingMap API"
    env: str = "local"
    host: str = "0.0.0.0"
    port: int = 8000
    # 로컬에서는 별도 인프라 없이 바로 시작할 수 있도록 SQLite를 기본값으로 둡니다.
    database_url: str = f"sqlite:///{BASE_DIR / 'weddingmap-local.db'}"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_minutes: int = 10080
    # 관리자 API는 기본적으로 인증을 강제하고, 테스트나 초기 로컬 부트스트랩에서만 끌 수 있게 합니다.
    admin_auth_enabled: bool = True
    admin_session_cookie_name: str = "weddingmap_admin_session"
    data_portal_api_key: str = "sample-data-portal-key"
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: object) -> object:
        """콤마 문자열이나 JSON 배열 모두 허용 출처 목록으로 받아들입니다."""

        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                return text
            return [item.strip() for item in text.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    """설정 객체를 한 번만 생성해 재사용합니다."""

    return Settings()


settings = get_settings()
