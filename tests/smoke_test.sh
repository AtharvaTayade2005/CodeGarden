#!/usr/bin/env bash
# ==============================================================================
# Code Garden - Automated Integration Smoke Test Suite
# Tests Next.js API endpoints, sandboxed Python runner, loop timeouts,
# botanical bug detection, and fading AI hint guardrails.
# ==============================================================================

set -euo pipefail

PORT="${PORT:-3005}"
BASE_URL="http://127.0.0.1:${PORT}"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping background dev server (PID: $SERVER_PID)..."
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "===================================================="
echo "  Code Garden Phase 5 Integration Smoke Test"
echo "  Target URL: ${BASE_URL}"
echo "===================================================="
echo ""

# Check if server is already running on the port
if curl -s -f -o /dev/null --connect-timeout 2 "${BASE_URL}/" 2>/dev/null; then
  echo "✓ Dev server is already active and healthy on port ${PORT}."
else
  echo "Starting Next.js server on port ${PORT}..."
  npx next dev -p "${PORT}" > /dev/null 2>&1 &
  SERVER_PID=$!
  
  # Wait up to 30 seconds for server to be responsive
  READY=0
  for i in $(seq 1 30); do
    if curl -s -f -o /dev/null --connect-timeout 1 "${BASE_URL}/" 2>/dev/null; then
      READY=1
      echo "✓ Dev server started successfully on port ${PORT} (PID: ${SERVER_PID})."
      break
    fi
    sleep 1
  done

  if [ "$READY" -eq 0 ]; then
    echo "✗ Failed to connect to server on port ${PORT} within 30 seconds."
    exit 1
  fi
fi

echo ""
PASSED_TESTS=0
TOTAL_TESTS=0

run_assertion() {
  local name="$1"
  local condition="$2"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  if eval "$condition"; then
    echo "  ✓ [PASS] ${name}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo "  ✗ [FAIL] ${name}"
    exit 1
  fi
}

# ------------------------------------------------------------------------------
# TEST 1: Correct Python code execution
# ------------------------------------------------------------------------------
echo "Test 1: Executing valid Python solution on /api/execute"
PAYLOAD_PASS='{"exerciseId":"variable-swap-print","code":"a = int(input())\nb = int(input())\na, b = b, a\nprint(f\"{a} {b}\")"}'

RESP_PASS=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_PASS")

HTTP_STATUS_PASS=$(echo "$RESP_PASS" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY_PASS=$(echo "$RESP_PASS" | grep -v "HTTP_STATUS:")

run_assertion "HTTP status is 200 for valid code execution" '[ "$HTTP_STATUS_PASS" -eq 200 ]'
run_assertion "Execution result contains passed: true" 'echo "$BODY_PASS" | grep -q "\"passed\":[ ]*true"'
run_assertion "Tree state awarded XP (+20 XP)" 'echo "$BODY_PASS" | grep -q "\"xp\":[ ]*[1-9]"'

# ------------------------------------------------------------------------------
# TEST 2: Infinite loop timeout and LOOP_WEED detection
# ------------------------------------------------------------------------------
echo ""
echo "Test 2: Executing infinite loop on /api/execute (Timeout & LOOP_WEED)"
PAYLOAD_LOOP='{"exerciseId":"accumulator-loop","code":"while True: pass"}'

RESP_LOOP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_LOOP")

HTTP_STATUS_LOOP=$(echo "$RESP_LOOP" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY_LOOP=$(echo "$RESP_LOOP" | grep -v "HTTP_STATUS:")

run_assertion "HTTP status is 200 for timed-out execution" '[ "$HTTP_STATUS_LOOP" -eq 200 ]'
run_assertion "Execution result contains passed: false" 'echo "$BODY_LOOP" | grep -q "\"passed\":[ ]*false"'
run_assertion "Detected bug is LOOP_WEED" 'echo "$BODY_LOOP" | grep -q "LOOP_WEED"'
run_assertion "Error type is TimeoutError" 'echo "$BODY_LOOP" | grep -q "TimeoutError"'

# ------------------------------------------------------------------------------
# TEST 3: Scaffolding hint generation & zero-tolerance guardrails
# ------------------------------------------------------------------------------
echo ""
echo "Test 3: Requesting Tier 1 scaffolding hint on /api/hint"
PAYLOAD_HINT='{"exerciseId":"variable-swap-print","code":"print(c)","attemptCount":1}'

RESP_HINT=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/api/hint" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_HINT")

HTTP_STATUS_HINT=$(echo "$RESP_HINT" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY_HINT=$(echo "$RESP_HINT" | grep -v "HTTP_STATUS:")

run_assertion "HTTP status is 200 for hint request" '[ "$HTTP_STATUS_HINT" -eq 200 ]'
run_assertion "Response contains tier 1 Socratic Question" 'echo "$BODY_HINT" | grep -q "\"tier\":[ ]*1"'
run_assertion "Hint contains guidance text" 'echo "$BODY_HINT" | grep -q "\"guidanceText\""'
run_assertion "Guardrail prevents direct solution code leak" '! echo "$BODY_HINT" | grep -q "a, b = b, a"'

# ------------------------------------------------------------------------------
# TEST 4: Edge Case - Empty code submission validation warning
# ------------------------------------------------------------------------------
echo ""
echo "Test 4: Submitting empty code to /api/execute"
PAYLOAD_EMPTY='{"exerciseId":"variable-swap-print","code":""}'

RESP_EMPTY=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD_EMPTY")

HTTP_STATUS_EMPTY=$(echo "$RESP_EMPTY" | grep "HTTP_STATUS:" | cut -d':' -f2)
BODY_EMPTY=$(echo "$RESP_EMPTY" | grep -v "HTTP_STATUS:")

run_assertion "HTTP status is 200 for empty code validation" '[ "$HTTP_STATUS_EMPTY" -eq 200 ]'
run_assertion "Empty code returns passed: false with warning" 'echo "$BODY_EMPTY" | grep -q "\"passed\":[ ]*false"'
run_assertion "Warning explains empty code" 'echo "$BODY_EMPTY" | grep -q "Validation Warning"'

echo ""
echo "===================================================="
echo "  ALL ${PASSED_TESTS}/${TOTAL_TESTS} INTEGRATION SMOKE TESTS PASSED!"
echo "===================================================="
exit 0
