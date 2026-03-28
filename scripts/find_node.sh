#!/usr/bin/env bash
# 사용자 폴더에 깨진 node 실행 파일이 있을 때 정상 node 경로만 골라내기 위한 보조 스크립트입니다.
set -euo pipefail

while IFS= read -r candidate; do
  if [ -x "$candidate" ] && [[ "$candidate" != *"/mnt/c/Users/Administrator/node_modules/"* ]]; then
    echo "$candidate"
    exit 0
  fi
done < <(which -a node 2>/dev/null || true)

echo "정상 node 실행 파일을 찾지 못했습니다." >&2
exit 1
