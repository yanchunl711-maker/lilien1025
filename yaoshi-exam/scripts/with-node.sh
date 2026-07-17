#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  bundled_node="${HOME}/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  if [[ -x "${bundled_node}" ]]; then
    export PATH="$(dirname "${bundled_node}"):${PATH}"
  else
    echo "未找到 Node.js，请先安装 Node.js 22 或更高版本。" >&2
    exit 1
  fi
fi

exec "$@"
