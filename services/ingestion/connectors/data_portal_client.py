"""공공데이터포털 응답을 안정적으로 가져오기 위한 HTTP 클라이언트 모듈."""

from dataclasses import dataclass, field
from typing import Any

import httpx


@dataclass(slots=True)
class DataPortalClient:
    """공공데이터포털의 기본 호출 규칙을 감싼 간단한 클라이언트입니다.

    현재 구현은 공공데이터포털의 게이트웨이 방식에서 자주 사용하는
    `serviceKey`, `pageNo`, `numOfRows`, `resultType` 파라미터를 기본으로 넣고,
    JSON 응답에서 실제 데이터 배열만 쉽게 꺼낼 수 있게 돕습니다.
    """

    api_key: str
    timeout_seconds: int = 10
    default_params: dict[str, Any] = field(
        default_factory=lambda: {
            "pageNo": 1,
            "numOfRows": 100,
            "resultType": "json",
            "type": "json",
        }
    )

    def fetch_json(self, url: str, extra_params: dict[str, Any] | None = None) -> dict[str, Any]:
        """공공데이터포털 URL에서 JSON 본문을 가져옵니다."""

        params = {"serviceKey": self.api_key, **self.default_params}
        if extra_params:
            params.update({key: value for key, value in extra_params.items() if value is not None})

        with httpx.Client(timeout=self.timeout_seconds) as client:
            response = client.get(url, params=params)
            response.raise_for_status()
            return response.json()

    def extract_items(self, payload: dict[str, Any]) -> list[dict[str, Any]]:
        """공공데이터포털의 대표적인 JSON 구조에서 실제 데이터 배열만 추출합니다."""

        if isinstance(payload.get("data"), list):
            return [item for item in payload["data"] if isinstance(item, dict)]

        response = payload.get("response")
        if isinstance(response, dict):
            body = response.get("body", {})
            items = body.get("items", {})
            raw_items = items.get("item", [])
            if isinstance(raw_items, dict):
                return [raw_items]
            if isinstance(raw_items, list):
                return [item for item in raw_items if isinstance(item, dict)]

        if isinstance(payload.get("records"), list):
            return [item for item in payload["records"] if isinstance(item, dict)]

        return []
