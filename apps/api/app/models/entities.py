from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import JSON, Boolean, DateTime, Enum as SqlEnum, Float, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def utc_now() -> datetime:
    """나이브 UTC 값을 일관되게 만들기 위한 공통 기본값 함수입니다."""

    return datetime.now(UTC).replace(tzinfo=None)


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class ReviewType(str, Enum):
    VISIT = "visit"
    CONTRACT = "contract"
    EVENT = "event"
    GUEST = "guest"


class ReviewStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    HIDDEN = "hidden"


class InquiryStatus(str, Enum):
    RECEIVED = "received"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class IngestionStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    RUNNING = "running"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    nickname: Mapped[str] = mapped_column(String(100))
    preferred_region_id: Mapped[int | None] = mapped_column(ForeignKey("regions.id"))
    budget_min: Mapped[int | None] = mapped_column(Integer)
    budget_max: Mapped[int | None] = mapped_column(Integer)
    expected_guest_count: Mapped[int | None] = mapped_column(Integer)
    role: Mapped[UserRole] = mapped_column(SqlEnum(UserRole), default=UserRole.USER)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(100))
    role_name: Mapped[str] = mapped_column(String(100), default="super_admin")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class Region(Base):
    __tablename__ = "regions"
    __table_args__ = (UniqueConstraint("sido", "sigungu", name="uq_region_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sido: Mapped[str] = mapped_column(String(50), index=True)
    sigungu: Mapped[str] = mapped_column(String(100), index=True)
    region_code: Mapped[str] = mapped_column(String(30), unique=True)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)


class Venue(Base):
    __tablename__ = "venues"
    __table_args__ = (
        Index("ix_venues_region_score", "region_id", "overall_score"),
        Index("ix_venues_public_active", "is_public_hall", "is_active"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    region_id: Mapped[int] = mapped_column(ForeignKey("regions.id"), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    address: Mapped[str] = mapped_column(String(255))
    road_address: Mapped[str | None] = mapped_column(String(255))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    phone: Mapped[str | None] = mapped_column(String(50))
    homepage_url: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    hall_type: Mapped[str | None] = mapped_column(String(100))
    mood_tags: Mapped[list[str] | None] = mapped_column(JSON)
    warranty_guest_min: Mapped[int | None] = mapped_column(Integer)
    warranty_guest_max: Mapped[int | None] = mapped_column(Integer)
    meal_price_min: Mapped[int | None] = mapped_column(Integer)
    meal_price_max: Mapped[int | None] = mapped_column(Integer)
    rental_fee_min: Mapped[int | None] = mapped_column(Integer)
    rental_fee_max: Mapped[int | None] = mapped_column(Integer)
    is_public_hall: Mapped[bool] = mapped_column(Boolean, default=False)
    is_single_hall: Mapped[bool] = mapped_column(Boolean, default=False)
    is_simultaneous_ceremony: Mapped[bool] = mapped_column(Boolean, default=False)
    can_outdoor: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    trust_grade: Mapped[str] = mapped_column(String(1), default="B")
    data_confidence_note: Mapped[str | None] = mapped_column(String(255))
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    review_rating: Mapped[float] = mapped_column(Float, default=0)
    overall_score: Mapped[float] = mapped_column(Float, default=0)
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime)
    source_type: Mapped[str] = mapped_column(String(50), default="manual")

    region: Mapped[Region] = relationship()
    halls: Mapped[list["VenueHall"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    pricings: Mapped[list["VenuePricing"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    meals: Mapped[list["VenueMeal"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    parking: Mapped[list["VenueParking"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    access: Mapped[list["VenueAccess"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    policies: Mapped[list["VenuePolicy"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    photos: Mapped[list["VenuePhoto"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(back_populates="venue", cascade="all, delete-orphan")


class VenueHall(Base):
    __tablename__ = "venue_halls"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    name: Mapped[str] = mapped_column(String(100))
    floor: Mapped[str | None] = mapped_column(String(50))
    hall_type: Mapped[str | None] = mapped_column(String(100))
    capacity_min: Mapped[int | None] = mapped_column(Integer)
    capacity_max: Mapped[int | None] = mapped_column(Integer)
    description: Mapped[str | None] = mapped_column(Text)
    venue: Mapped[Venue] = relationship(back_populates="halls")


class VenuePricing(Base):
    __tablename__ = "venue_pricings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    item_name: Mapped[str] = mapped_column(String(100))
    price_min: Mapped[int] = mapped_column(Integer)
    price_max: Mapped[int] = mapped_column(Integer)
    unit: Mapped[str] = mapped_column(String(50), default="원")
    notes: Mapped[str | None] = mapped_column(String(255))
    venue: Mapped[Venue] = relationship(back_populates="pricings")


class VenueMeal(Base):
    __tablename__ = "venue_meals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    meal_type: Mapped[str] = mapped_column(String(100))
    price_per_person: Mapped[int] = mapped_column(Integer)
    is_buffet: Mapped[bool] = mapped_column(Boolean, default=True)
    has_noodle_station: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(String(255))
    venue: Mapped[Venue] = relationship(back_populates="meals")


class VenueParking(Base):
    __tablename__ = "venue_parkings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    parking_slots: Mapped[int] = mapped_column(Integer)
    free_minutes: Mapped[int | None] = mapped_column(Integer)
    valet_available: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(String(255))
    venue: Mapped[Venue] = relationship(back_populates="parking")


class VenueAccess(Base):
    __tablename__ = "venue_access"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    subway_line: Mapped[str | None] = mapped_column(String(100))
    subway_minutes: Mapped[int | None] = mapped_column(Integer)
    bus_stop_name: Mapped[str | None] = mapped_column(String(100))
    bus_minutes: Mapped[int | None] = mapped_column(Integer)
    shuttle_available: Mapped[bool] = mapped_column(Boolean, default=False)
    venue: Mapped[Venue] = relationship(back_populates="access")


class VenuePolicy(Base):
    __tablename__ = "venue_policies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    policy_type: Mapped[str] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text)
    flexibility_score: Mapped[int | None] = mapped_column(Integer)
    venue: Mapped[Venue] = relationship(back_populates="policies")


class VenuePhoto(Base):
    __tablename__ = "venue_photos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    image_url: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50), default="hall")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    venue: Mapped[Venue] = relationship(back_populates="photos")


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True)
    review_type: Mapped[ReviewType] = mapped_column(SqlEnum(ReviewType), default=ReviewType.VISIT)
    title: Mapped[str] = mapped_column(String(150))
    content: Mapped[str] = mapped_column(Text)
    rating_overall: Mapped[float] = mapped_column(Float)
    rating_food: Mapped[float] = mapped_column(Float)
    rating_access: Mapped[float] = mapped_column(Float)
    rating_parking: Mapped[float] = mapped_column(Float)
    rating_mood: Mapped[float] = mapped_column(Float)
    rating_contract: Mapped[float] = mapped_column(Float)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[ReviewStatus] = mapped_column(SqlEnum(ReviewStatus), default=ReviewStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    venue: Mapped[Venue] = relationship(back_populates="reviews")


class ReviewPhoto(Base):
    __tablename__ = "review_photos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    review_id: Mapped[int] = mapped_column(ForeignKey("reviews.id"), index=True)
    image_url: Mapped[str] = mapped_column(String(255))


class Bookmark(Base):
    __tablename__ = "bookmarks"
    __table_args__ = (UniqueConstraint("user_id", "venue_id", name="uq_bookmark"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class ComparisonSet(Base):
    __tablename__ = "comparison_sets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(150), default="기본 비교함")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class ComparisonSetItem(Base):
    __tablename__ = "comparison_set_items"
    __table_args__ = (UniqueConstraint("comparison_set_id", "venue_id", name="uq_comparison_item"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    comparison_set_id: Mapped[int] = mapped_column(ForeignKey("comparison_sets.id"), index=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), index=True)


class Inquiry(Base):
    __tablename__ = "inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True)
    venue_id: Mapped[int | None] = mapped_column(ForeignKey("venues.id"), index=True)
    name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(50))
    email: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    preferred_contact_time: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[InquiryStatus] = mapped_column(SqlEnum(InquiryStatus), default=InquiryStatus.RECEIVED)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    venue: Mapped[Venue | None] = relationship()


class DataIngestionLog(Base):
    __tablename__ = "data_ingestion_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_name: Mapped[str] = mapped_column(String(150), index=True)
    status: Mapped[IngestionStatus] = mapped_column(SqlEnum(IngestionStatus), default=IngestionStatus.RUNNING)
    total_count: Mapped[int] = mapped_column(Integer, default=0)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    failure_count: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text)
    payload: Mapped[dict | None] = mapped_column(JSON)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_type: Mapped[str] = mapped_column(String(50))
    actor_id: Mapped[int | None] = mapped_column(Integer)
    action: Mapped[str] = mapped_column(String(100), index=True)
    target_type: Mapped[str] = mapped_column(String(100))
    target_id: Mapped[int | None] = mapped_column(Integer)
    metadata_json: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
