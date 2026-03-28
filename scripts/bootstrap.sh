#!/usr/bin/env bash
# 로컬 또는 Docker 환경에서 개발용 실행 기반을 빠르게 준비하는 스크립트입니다.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  echo "Node 의존성을 설치합니다."
  npm install
fi

if command -v docker >/dev/null 2>&1; then
  # Docker가 있으면 운영과 가까운 PostgreSQL, Redis 조합으로 준비합니다.
  docker compose up -d postgres redis
else
  echo "docker를 찾지 못해 SQLite 개발 모드로 진행합니다."
fi

python3 -m venv apps/api/.venv || true
source apps/api/.venv/bin/activate
pip install -r apps/api/requirements.txt
export PYTHONPATH=apps/api
if command -v docker >/dev/null 2>&1; then
  python apps/api/app/db/wait_for_db.py
fi
python -m app.db.run_migrations
python -m app.db.seed
echo "초기 준비가 완료되었습니다. API는 'npm run dev:api', 웹은 'npm run dev:web', 관리는 'npm run dev:admin'으로 실행할 수 있습니다."
