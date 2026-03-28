"""WeddingMap 수집기 실행 진입점입니다."""

import argparse
import json
import os
from pathlib import Path

from connectors.data_portal_client import DataPortalClient
from parsers.public_venue_parser import normalize_public_venue_rows, parse_public_venues
from services.merge_service import summarize_merge_result


def build_parser() -> argparse.ArgumentParser:
    """명령행 인자를 구성합니다."""

    parser = argparse.ArgumentParser(description="WeddingMap 공공데이터 수집기")
    parser.add_argument("--mode", default="sample", choices=["sample", "file", "portal"])
    parser.add_argument("--file", default=str(Path(__file__).resolve().parents[2] / "sample-data" / "venues.json"))
    parser.add_argument("--url", default=os.getenv("DATA_PORTAL_API_URL", ""))
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--rows", type=int, default=100)
    return parser


def main() -> None:
    """수집 모드에 따라 파일 또는 공공데이터포털에서 데이터를 읽습니다."""

    parser = build_parser()
    args = parser.parse_args()

    if args.mode in {"sample", "file"}:
        venues = parse_public_venues(Path(args.file))
    else:
        api_key = os.getenv("APP_DATA_PORTAL_API_KEY", "")
        if not api_key:
            raise RuntimeError("공공데이터포털 연동에는 APP_DATA_PORTAL_API_KEY 환경 변수가 필요합니다.")
        if not args.url:
            raise RuntimeError("공공데이터포털 연동에는 --url 또는 DATA_PORTAL_API_URL 값이 필요합니다.")

        client = DataPortalClient(api_key=api_key)
        payload = client.fetch_json(args.url, {"pageNo": args.page, "numOfRows": args.rows})
        venues = normalize_public_venue_rows(client.extract_items(payload))

    result = summarize_merge_result(venues)
    print(json.dumps({"venues": venues, "summary": result}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
