from fastapi import APIRouter

from app.schemas.budget import BudgetRequest
from app.services.budget import calculate_budget

router = APIRouter()


@router.post("/estimate")
def estimate_budget(payload: BudgetRequest):
    result = calculate_budget(payload)
    return {"success": True, "data": result.model_dump()}


@router.post("/calculate")
def calculate_budget_alias(payload: BudgetRequest):
    """문서 기준 경로와의 호환성을 위해 같은 계산 로직을 별칭으로 제공합니다."""

    return estimate_budget(payload)
