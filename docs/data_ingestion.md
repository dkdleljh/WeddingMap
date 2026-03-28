# 데이터 수집 가이드

## 1. 목적
WeddingMap의 데이터 수집기는 공공데이터포털과 운영자 보강 데이터를 함께 다루기 위한 시작점입니다.  
현재 목표는 전국 예식장 기본 정보를 표준 구조로 모으고, 운영자가 부족한 가격과 계약 정보를 이어서 보완할 수 있게 하는 것입니다.

## 2. 지원하는 입력 방식
### 샘플 모드
- 개발용 `sample-data/venues.json`을 읽습니다.
- 화면 개발과 테스트에 가장 빠르게 사용할 수 있습니다.

### 파일 모드
- 운영자 또는 외부 파이프라인이 만든 JSON 파일을 읽습니다.
- 구조가 크게 다르지 않다면 내부 표준 구조로 정규화할 수 있습니다.

### 공공데이터포털 모드
- 공공데이터포털 게이트웨이 방식 OpenAPI URL을 직접 받아 호출합니다.
- 현재 구현은 JSON 응답을 기준으로 동작합니다.
- 대표적으로 다음 응답 구조를 지원합니다.
  - `response.body.items.item`
  - `data`
  - `records`

## 3. 공공데이터포털 연동 점검 결과
### 현재 코드 상태
- `services/ingestion/connectors/data_portal_client.py`
  - `serviceKey`, `pageNo`, `numOfRows`, `resultType`, `type` 기본 파라미터를 넣습니다.
  - JSON 응답에서 실제 행 목록만 추출하는 `extract_items`를 제공합니다.
- `services/ingestion/parsers/public_venue_parser.py`
  - 샘플 구조와 공공데이터포털 행 구조를 모두 내부 표준 구조로 정규화합니다.
  - `예식장명`, `시설명`, `시도명`, `시군구명`, `소재지도로명주소` 같은 공공데이터 필드를 읽을 수 있습니다.
- `services/ingestion/run_ingestion.py`
  - `sample`, `file`, `portal` 모드를 지원합니다.

### 공식 연동 기준
공공데이터포털의 게이트웨이 방식 안내 문서 기준으로 일반 인증키는 `serviceKey` 파라미터로 전달하며, 페이지 처리 시 `pageNo`, `numOfRows`, JSON 응답 시 `resultType=json` 또는 `type=json` 사용이 일반적입니다.  
참고 문서:
- data.go.kr 게이트웨이 방식 API 호출 안내 PDF

### 현재 남아 있는 한계
- 실제 예식장 표준데이터 API URL은 운영 환경에서 확정해야 합니다.
- XML만 제공하는 원천은 아직 별도 XML 파서를 구현하지 않았습니다.
- 주소 정규화, 좌표 보정, 상세 병합 점수 계산은 아직 고도화 대상입니다.

## 4. 실행 예시
### 샘플 파일 실행
```bash
python services/ingestion/run_ingestion.py --mode sample
```

### 임의 JSON 파일 실행
```bash
python services/ingestion/run_ingestion.py --mode file --file ./sample-data/venues.json
```

### 공공데이터포털 실행
```bash
export APP_DATA_PORTAL_API_KEY="발급받은_일반인증키"
export DATA_PORTAL_API_URL="https://apis.data.go.kr/..."
python services/ingestion/run_ingestion.py --mode portal --url "$DATA_PORTAL_API_URL"
```

## 5. 내부 표준 구조
수집기는 다음 핵심 값을 최소 단위로 정규화합니다.
- 이름
- 슬러그
- 시도
- 시군구
- 주소
- 공공예식장 여부
- 최소 식대
- 최대 식대
- 데이터 신뢰도 등급
- 원천 행 전체

## 6. 운영 시 확인할 항목
- 동일 슬러그가 중복으로 생성되지 않았는지 확인
- 주소가 비어 있는 데이터가 과도하지 않은지 확인
- 공공예식장 분류가 잘 들어왔는지 확인
- 시도, 시군구 값이 정상적으로 분리되었는지 확인
- 운영자 보강 데이터와 충돌하는 필드가 없는지 확인

## 7. 다음 고도화 항목
- XML 응답 파서 추가
- 주소 정규화 API 연계
- 좌표 보정 및 역지오코딩
- 수집 실패 재시도 큐
- 수집 이력의 행 단위 오류 저장
- 자동 중복 후보 추천 점수
