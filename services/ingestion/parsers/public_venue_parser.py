"""예식장 원천 데이터를 WeddingMap 내부 표준 구조로 바꾸는 파서 모듈."""

import json
from pathlib import Path
from typing import Any


def _clean_text(value: Any) -> str:
    """문자열이 아니거나 비어 있는 값을 안전한 문자열로 바꿉니다."""

    if value is None:
        return ""
    return str(value).strip()


def normalize_public_venue_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """공공데이터포털 원본 행 또는 샘플 행을 내부 공통 구조로 정규화합니다."""

    items: list[dict[str, Any]] = []
    for row in rows:
        region = row.get("region", {}) if isinstance(row.get("region"), dict) else {}
        name = _clean_text(row.get("name") or row.get("시설명") or row.get("예식장명"))
        sido = _clean_text(region.get("sido") or row.get("시도명") or row.get("시도"))
        sigungu = _clean_text(region.get("sigungu") or row.get("시군구명") or row.get("시군구"))
        address = _clean_text(row.get("address") or row.get("소재지도로명주소") or row.get("소재지지번주소"))
        slug = _clean_text(row.get("slug")) or f"{name}-{sido}-{sigungu}".lower().replace(" ", "-")

        items.append(
            {
                "name": name,
                "slug": slug,
                "sido": sido,
                "sigungu": sigungu,
                "address": address,
                "is_public_hall": bool(row.get("is_public_hall") or row.get("공공예식장여부") in {"Y", "y", "예", "true", True}),
                "meal_price_min": row.get("meal_price_min"),
                "meal_price_max": row.get("meal_price_max"),
                "trust_grade": row.get("trust_grade", "B"),
                "source_row": row,
            }
        )
    return items


def parse_public_venues(path: Path) -> list[dict[str, Any]]:
    """파일 기반 원천 데이터를 읽어 정규화된 예식장 목록으로 반환합니다."""

    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        return normalize_public_venue_rows(payload)
    if isinstance(payload, dict):
        rows = payload.get("data") or payload.get("records") or []
        if isinstance(rows, list):
            return normalize_public_venue_rows(rows)
    return []
