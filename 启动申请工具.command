#!/bin/zsh
set -e
cd -- "$(dirname -- "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo "请先安装 Node.js 24 或更高版本。"
  read -k 1
  exit 1
fi
if curl -fsS --max-time 2 http://127.0.0.1:4317/api/state >/dev/null 2>&1; then
  open http://127.0.0.1:4317
  exit 0
fi
if [ ! -d node_modules ]; then npm install; fi
if [ ! -f dist/index.html ]; then npm run build; fi
(sleep 2; open http://127.0.0.1:4317) &
echo "关闭此窗口会停止网站。文件与进度会保留在本机。"
exec npm start
