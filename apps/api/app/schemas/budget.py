from pydantic import BaseModel, Field


class BudgetRequest(BaseModel):
    expected_guest_count: int = Field(ge=10, le=1000)
    meal_guest_count: int = Field(ge=10, le=1000)
    preferred_region: str
    preferred_style: str
    total_budget: int = Field(ge=1000000)
    include_rental_fee: bool = True
    include_flower_decor: bool = True
    include_extra_options: bool = True


class BudgetResponse(BaseModel):
    expected_total_min: int
    expected_total_max: int
    meal_cost: int
    rental_fee: int
    option_cost: int
    fitness_label: str
    recommendation_reason: str
