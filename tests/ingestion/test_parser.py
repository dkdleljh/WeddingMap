"""수집 파서가 공공데이터와 샘플 데이터를 모두 읽을 수 있는지 검증합니다."""

from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[2] / "services" / "ingestion"))

from connectors.data_portal_client import DataPortalClient
from parsers.public_venue_parser import normalize_public_venue_rows, parse_public_venues


def test_parse_public_venues_returns_multiple_regions():
    path = Path(__file__).resolve().parents[2] / "sample-data" / "venues.json"
    venues = parse_public_venues(path)
    assert len(venues) >= 6
    assert {venue["sido"] for venue in venues} >= {"서울", "경기", "부산"}


def test_extract_items_supports_gateway_response_shape():
    client = DataPortalClient(api_key="dummy-key")
    payload = {
        "response": {
            "body": {
                "items": {
                    "item": [
                        {"예식장명": "서울 공공 예식장", "시도명": "서울", "시군구명": "중구", "소재지도로명주소": "서울 중구 세종대로 1"},
                    ]
                }
            }
        }
    }

    rows = client.extract_items(payload)
    normalized = normalize_public_venue_rows(rows)

    assert len(normalized) == 1
    assert normalized[0]["name"] == "서울 공공 예식장"
    assert normalized[0]["sido"] == "서울"
