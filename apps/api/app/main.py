from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, auth, bookmarks, budget, comparisons, ingestion, inquiries, regions, reviews, users, venues
from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()

app = FastAPI(
    title=settings.app_name,
    description="전국 예식장 탐색과 비교 분석을 위한 WeddingMap API",
    version="0.1.2",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}


app.include_router(auth.router, prefix="/api/auth", tags=["인증"])
app.include_router(users.router, prefix="/api/users", tags=["사용자"])
app.include_router(regions.router, prefix="/api/regions", tags=["지역"])
app.include_router(venues.router, prefix="/api/venues", tags=["예식장"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["리뷰"])
app.include_router(bookmarks.router, prefix="/api/bookmarks", tags=["찜"])
app.include_router(comparisons.router, prefix="/api/comparisons", tags=["비교함"])
app.include_router(inquiries.router, prefix="/api/inquiries", tags=["문의"])
app.include_router(budget.router, prefix="/api/budget", tags=["예산 계산기"])
app.include_router(admin.router, prefix="/api/admin", tags=["관리자"])
app.include_router(ingestion.router, prefix="/api/ingestion", tags=["데이터 수집"])
