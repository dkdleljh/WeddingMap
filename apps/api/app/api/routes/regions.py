from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Region

router = APIRouter()


@router.get("")
def list_regions(db: Session = Depends(get_db)):
    items = db.scalars(select(Region).order_by(Region.sido.asc(), Region.sigungu.asc())).all()
    return {"success": True, "data": [{"id": item.id, "sido": item.sido, "sigungu": item.sigungu, "region_code": item.region_code} for item in items]}
