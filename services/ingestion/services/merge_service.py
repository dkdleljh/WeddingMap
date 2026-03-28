"""수집 결과를 운영자가 빠르게 확인할 수 있도록 요약합니다."""


def summarize_merge_result(venues: list[dict]) -> dict:
    """중복 후보와 공공예식장 비중을 계산해 간단한 요약 결과를 만듭니다."""

    duplicate_candidates = len({item["slug"] for item in venues}) != len(venues)
    public_count = len([item for item in venues if item["is_public_hall"]])
    return {
        "total_count": len(venues),
        "public_count": public_count,
        "duplicate_candidates": duplicate_candidates,
        "message": "수집 결과를 기준으로 계산한 병합 요약입니다",
    }
