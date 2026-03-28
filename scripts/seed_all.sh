#!/usr/bin/env bash
# 샘플 예식장 데이터와 수집기 실행 결과를 함께 준비하는 스크립트입니다.
set -euo pipefail

cd "$(dirname "$0")/.."
if [ -d apps/api/.venv ]; then
  source apps/api/.venv/bin/activate
fi
export PYTHONPATH=apps/api
python -m app.db.seed
python services/ingestion/run_ingestion.py --mode sample
