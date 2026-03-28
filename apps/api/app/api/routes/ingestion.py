from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.entities import AdminUser, DataIngestionLog, IngestionStatus, utc_now

router = APIRouter()


@router.get("/logs")
def list_ingestion_logs(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    rows = db.scalars(select(DataIngestionLog).order_by(DataIngestionLog.started_at.desc())).all()
    return {"success": True, "data": [{"id": row.id, "source_name": row.source_name, "status": row.status.value, "success_count": row.success_count, "failure_count": row.failure_count, "started_at": row.started_at.isoformat()} for row in rows]}


@router.post("/run")
def run_ingestion(db: Session = Depends(get_db), _: AdminUser = Depends(require_admin)):
    log = DataIngestionLog(
        source_name="전국결혼식장및예식장표준데이터",
        status=IngestionStatus.SUCCESS,
        total_count=24,
        success_count=24,
        failure_count=0,
        notes="샘플 적재 모드 실행",
        started_at=utc_now(),
        finished_at=utc_now(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"success": True, "message": "수집 작업이 기록되었습니다", "data": {"id": log.id, "status": log.status.value}}
