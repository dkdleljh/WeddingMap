"""예산 계산기의 핵심 계산 규칙을 담은 서비스 모듈입니다."""

from app.schemas.budget import BudgetRequest, BudgetResponse

# 지역별 평균 대관료는 운영자가 추후 설정 파일이나 테이블로 옮기기 쉽게 상수로 분리합니다.
REGION_BASE_RENTAL = {
    "서울": 9000000,
    "경기": 7000000,
    "부산": 6500000,
    "대구": 6000000,
    "광주": 5500000,
    "대전": 5500000,
}

STYLE_OPTION_MULTIPLIER = {
    "호텔": 1.2,
    "하우스": 1.1,
    "공공": 0.8,
    "채플": 1.0,
    "컨벤션": 1.0,
}


def calculate_budget(payload: BudgetRequest) -> BudgetResponse:
    """입력 조건을 바탕으로 예상 총비용 구간과 예산 적합도를 계산합니다."""

    # 현재 MVP는 식대 평균값을 사용하지만, 향후에는 지역별 평균 식대와 실제 예식장 가격으로 대체합니다.
    meal_cost = payload.meal_guest_count * 65000
    base_rental = REGION_BASE_RENTAL.get(payload.preferred_region, 6000000)
    style_multiplier = STYLE_OPTION_MULTIPLIER.get(payload.preferred_style, 1.0)
    rental_fee = int(base_rental * style_multiplier) if payload.include_rental_fee else 0

    option_cost = 0
    # 옵션 비용은 사용자가 자주 비교하는 필수 항목만 먼저 반영합니다.
    if payload.include_flower_decor:
        option_cost += 1800000
    if payload.include_extra_options:
        option_cost += 2400000

    total_min = meal_cost + rental_fee + option_cost
    # 실제 계약 과정에서 발생하는 변동 폭을 반영하기 위해 상한 추정값을 별도로 계산합니다.
    total_max = int(total_min * 1.15)

    if total_max <= payload.total_budget * 0.9:
        fitness = "여유"
    elif total_max <= payload.total_budget:
        fitness = "적정"
    elif total_max <= payload.total_budget * 1.1:
        fitness = "빠듯함"
    else:
        fitness = "초과"

    return BudgetResponse(
        expected_total_min=total_min,
        expected_total_max=total_max,
        meal_cost=meal_cost,
        rental_fee=rental_fee,
        option_cost=option_cost,
        fitness_label=fitness,
        recommendation_reason=f"{payload.preferred_region} 지역 기준으로 {fitness} 수준의 예산입니다.",
    )
