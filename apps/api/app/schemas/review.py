from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    venue_id: int
    review_type: str
    title: str = Field(min_length=2, max_length=150)
    content: str = Field(min_length=10)
    rating_food: float = Field(ge=1, le=5)
    rating_access: float = Field(ge=1, le=5)
    rating_parking: float = Field(ge=1, le=5)
    rating_mood: float = Field(ge=1, le=5)
    rating_contract: float = Field(ge=1, le=5)


class ReviewItem(BaseModel):
    id: int
    title: str
    content: str
    review_type: str
    rating_overall: float
    is_verified: bool
    status: str
    created_at: datetime
