from app.schemas.budget import BudgetRequest
from app.services.budget import calculate_budget


def test_budget_service_returns_expected_range():
    result = calculate_budget(
        BudgetRequest(
            expected_guest_count=220,
            meal_guest_count=220,
            preferred_region="서울",
            preferred_style="호텔",
            total_budget=30000000,
            include_rental_fee=True,
            include_flower_decor=True,
            include_extra_options=True,
        )
    )
    assert result.expected_total_min > 0
    assert result.expected_total_max >= result.expected_total_min
