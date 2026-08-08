#!/usr/bin/env bash
set -euo pipefail

# scripts/test-invite.sh
# Local smoke test for /invite/bot
# Usage: set environment variables (DISCORD_CLIENT_ID, SESSION_SECRET, etc.) and run: bash scripts/test-invite.sh

# 1) Syntax check
echo "-> node --check server.js"
node --check server.js

# 2) Start server in background
echo "-> starting server"
nohup node server.js >/tmp/rinny-server.log 2>&1 &
SERVER_PID=$!
trap 'echo "Stopping server..."; kill $SERVER_PID || true' EXIT

# 3) Wait for server to be ready
echo "-> waiting for server"
for i in {1..20}; do
  if curl -sSf http://localhost:3000/ >/dev/null 2>&1; then
    echo "server ready"
    break
  fi
  sleep 1
done

# 4) Positive case: numeric permissions
echo "-> test: permissions=8 (expect 302)"
HEADERS=$(curl -i -sS "http://localhost:3000/invite/bot?permissions=8" || true)
echo "$HEADERS"
if ! echo "$HEADERS" | grep -qE "HTTP/1.1 302|HTTP/2 302"; then
  echo "Expected 302 for permissions=8" >&2; exit 1
fi
if ! echo "$HEADERS" | grep -qi "permissions=8"; then
  echo "Location header missing permissions=8" >&2; exit 1
fi

# 5) Negative: alphabetic
echo "-> test: permissions=abc (expect 400)"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/invite/bot?permissions=abc")
if [ "$CODE" != "400" ]; then echo "Expected 400 for permissions=abc, got $CODE" >&2; exit 1; fi

# 6) Negative: mixed
echo "-> test: permissions=8abc (expect 400)"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/invite/bot?permissions=8abc")
if [ "$CODE" != "400" ]; then echo "Expected 400 for permissions=8abc, got $CODE" >&2; exit 1; fi

echo "All invite tests passed"
