"""예식장 비교와 추천에 사용하는 점수 계산 서비스입니다."""

from dataclasses import dataclass


@dataclass(frozen=True)
class ScoreWeights:
    """종합 점수 가중치를 한 곳에서 관리하기 위한 불변 설정 객체입니다."""

    price: int = 20
    food: int = 20
    access: int = 15
    parking: int = 10
    mood: int = 15
    contract: int = 10
    review_confidence: int = 10


DEFAULT_WEIGHTS = ScoreWeights()


def calculate_overall_score(
    price_score: float,
    food_score: float,
    access_score: float,
    parking_score: float,
    mood_score: float,
    contract_score: float,
    review_confidence_score: float,
    weights: ScoreWeights = DEFAULT_WEIGHTS,
) -> float:
    """항목별 점수와 가중치를 받아 100점 만점 기준의 종합 점수를 계산합니다."""

    total_weight = sum(weights.__dict__.values())
    weighted_sum = (
        price_score * weights.price
        + food_score * weights.food
        + access_score * weights.access
        + parking_score * weights.parking
        + mood_score * weights.mood
        + contract_score * weights.contract
        + review_confidence_score * weights.review_confidence
    )
    return round(weighted_sum / total_weight, 2)


def review_confidence(review_count: int, verified_ratio: float) -> float:
    """리뷰 수와 인증 비율을 함께 반영해 리뷰 신뢰도 점수를 계산합니다."""

    volume_bonus = min(review_count / 20, 1.0)
    return round((volume_bonus * 3 + verified_ratio * 2) * 20, 2)
