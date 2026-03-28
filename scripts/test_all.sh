#!/usr/bin/env bash
# 백엔드, 수집기, 사용자 앱, 관리자 앱 테스트를 한 번에 실행하는 스크립트입니다.
set -euo pipefail

cd "$(dirname "$0")/.."
if [ -f apps/api/.venv/bin/activate ]; then
  source apps/api/.venv/bin/activate
fi
export PYTHONPATH=apps/api
NODE_BIN="$(./scripts/find_node.sh)"
PYTHON_BIN="${PYTHON_BIN:-python3}"
if command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
fi
"$PYTHON_BIN" -m pytest tests/api tests/ingestion
"$NODE_BIN" ./node_modules/vitest/vitest.mjs run --config apps/web/vitest.config.ts
"$NODE_BIN" ./node_modules/vitest/vitest.mjs run --config apps/admin/vitest.config.ts
echo "전체 테스트가 통과했습니다."
