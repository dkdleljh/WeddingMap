from pydantic import BaseModel


class VenueFilterQuery(BaseModel):
    sido: str | None = None
    sigungu: str | None = None
    keyword: str | None = None
    budget_min: int | None = None
    budget_max: int | None = None
    meal_price_min: int | None = None
    meal_price_max: int | None = None
    guest_count: int | None = None
    hall_type: str | None = None
    public_only: bool = False
    order_by: str = "score_desc"
    page: int = 1
    page_size: int = 12
