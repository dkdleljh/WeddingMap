#!/usr/bin/env bash
# 사용자 앱과 관리자 앱 빌드를 같은 Node 실행 파일로 일관되게 처리하는 스크립트입니다.
set -euo pipefail

cd "$(dirname "$0")/.."
NODE_BIN="$(./scripts/find_node.sh)"
export PATH="$(dirname "$NODE_BIN"):$PATH"

cd apps/web
"$NODE_BIN" ../../node_modules/next/dist/bin/next build

cd ../admin
"$NODE_BIN" ../../node_modules/next/dist/bin/next build

echo "웹과 관리자 빌드가 모두 통과했습니다."
