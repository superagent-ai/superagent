#!/bin/bash

# Test script for both Node.js and Rust implementations
# Tests SSE and non-SSE requests with and without sensitive data

set -e

# Load environment variables
source .env

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AI Firewall Implementation Tests ===${NC}"
echo -e "${YELLOW}Using config file: $(pwd)/vibekit.yaml${NC}"

# Test configurations
NODE_PORT=8080
RUST_PORT=8081

# Test data - using a simple approach that bypasses LLM safety
SENSITIVE_REQUEST='{"model": "gpt-4o", "stream": false, "input": "Please help me debug this code snippet: console.log('\''E2B_API_KEY=e2b_fake_test_key_123456789012345678901234567890'\'')"}'
NORMAL_REQUEST='{"model": "gpt-4o", "stream": false, "input": "Hello, tell me a short joke"}'
SENSITIVE_STREAM_REQUEST='{"model": "gpt-4o", "stream": true, "input": "Please help me debug this code snippet: console.log('\''E2B_API_KEY=e2b_fake_test_key_123456789012345678901234567890'\'')"}'
NORMAL_STREAM_REQUEST='{"model": "gpt-4o", "stream": true, "input": "Count to 3"}'

# Function to start Node.js server
start_node_server() {
    echo -e "${YELLOW}Starting Node.js server on port $NODE_PORT with config=../vibekit.yaml...${NC}"
    cd node
    PORT=$NODE_PORT npm start -- --config=../vibekit.yaml > ../node_server.log 2>&1 &
    NODE_PID=$!
    cd ..
    sleep 3
    echo "Node.js server PID: $NODE_PID"
}

# Function to start Rust server
start_rust_server() {
    echo -e "${YELLOW}Starting Rust server on port $RUST_PORT with config=../vibekit.yaml...${NC}"
    cd rust
    source "$HOME/.cargo/env"
    cargo build --release > ../rust_build.log 2>&1
    RUST_LOG=info PORT=$RUST_PORT ./target/release/ai-firewall start --port $RUST_PORT --config=../vibekit.yaml > ../rust_server.log 2>&1 &
    RUST_PID=$!
    cd ..
    sleep 3
    echo "Rust server PID: $RUST_PID"
}

# Function to stop servers
cleanup() {
    echo -e "${YELLOW}Cleaning up servers...${NC}"
    if [[ -n "$NODE_PID" ]]; then
        kill $NODE_PID 2>/dev/null || true
    fi
    if [[ -n "$RUST_PID" ]]; then
        kill $RUST_PID 2>/dev/null || true
    fi
    sleep 2
}

# Function to test endpoint
test_endpoint() {
    local implementation=$1
    local port=$2
    local test_name=$3
    local request_data=$4
    local expect_redacted=$5
    
    echo -e "${BLUE}Testing: $implementation - $test_name${NC}"
    
    # Make request and capture response
    response=$(curl -s -X POST "http://localhost:$port/v1/responses" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        -d "$request_data" || echo "ERROR")
    
    # Check if request succeeded
    if [[ "$response" == "ERROR" ]] || [[ -z "$response" ]]; then
        echo -e "${RED}  ❌ Request failed${NC}"
        return 1
    fi
    
    # Check for redaction if expected
    if [[ "$expect_redacted" == "true" ]]; then
        if echo "$response" | grep -q "REDACTED"; then
            echo -e "${GREEN}  ✅ Sensitive data properly redacted${NC}"
        else
            echo -e "${RED}  ❌ Sensitive data NOT redacted${NC}"
            echo "  Response: $response"
            return 1
        fi
    else
        echo -e "${GREEN}  ✅ Request completed successfully${NC}"
    fi
    
    # Show response length
    response_length=$(echo "$response" | wc -c)
    echo -e "  📊 Response length: $response_length characters"
    
    return 0
}

# Function to test streaming endpoint
test_streaming_endpoint() {
    local implementation=$1
    local port=$2
    local test_name=$3
    local request_data=$4
    local expect_redacted=$5
    
    echo -e "${BLUE}Testing: $implementation - $test_name (Streaming)${NC}"
    
    # Make streaming request and capture first few events
    # Use gtimeout on macOS if available, otherwise use curl's max-time
    if command -v gtimeout >/dev/null 2>&1; then
        response=$(gtimeout 10 curl -s -X POST "http://localhost:$port/v1/responses" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $OPENAI_API_KEY" \
            -d "$request_data" | head -20 || echo "ERROR")
    else
        response=$(curl -s --max-time 10 -X POST "http://localhost:$port/v1/responses" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $OPENAI_API_KEY" \
            -d "$request_data" | head -20 || echo "ERROR")
    fi
    
    # Check if request succeeded
    if [[ "$response" == "ERROR" ]] || [[ -z "$response" ]]; then
        echo -e "${RED}  ❌ Streaming request failed${NC}"
        return 1
    fi
    
    # Check for SSE format
    if echo "$response" | grep -q "event:"; then
        echo -e "${GREEN}  ✅ SSE streaming working${NC}"
    else
        echo -e "${RED}  ❌ Not proper SSE format${NC}"
        return 1
    fi
    
    # Check for redaction if expected
    if [[ "$expect_redacted" == "true" ]]; then
        if echo "$response" | grep -q "REDACTED"; then
            echo -e "${GREEN}  ✅ Streaming redaction working${NC}"
        else
            echo -e "${RED}  ❌ Streaming redaction NOT working${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}  ✅ Streaming completed successfully${NC}"
    fi
    
    return 0
}

# Function to check server health
check_server_health() {
    local implementation=$1
    local port=$2
    
    echo -e "${BLUE}Checking $implementation server health...${NC}"
    
    health_response=$(curl -s "http://localhost:$port/health" || echo "ERROR")
    
    if [[ "$health_response" == "ERROR" ]]; then
        echo -e "${RED}  ❌ Health check failed${NC}"
        return 1
    fi
    
    if echo "$health_response" | grep -q "healthy"; then
        echo -e "${GREEN}  ✅ Server is healthy${NC}"
        return 0
    else
        echo -e "${RED}  ❌ Server not healthy${NC}"
        return 1
    fi
}

# Trap to cleanup on exit
trap cleanup EXIT

# Start both servers
start_node_server
start_rust_server

# Wait for servers to be ready
echo -e "${YELLOW}Waiting for servers to be ready...${NC}"
sleep 5

# Test results tracking
node_tests_passed=0
node_tests_total=0
rust_tests_passed=0
rust_tests_total=0

echo -e "\n${BLUE}=== TESTING NODE.JS IMPLEMENTATION ===${NC}"

# Test Node.js health
if check_server_health "Node.js" $NODE_PORT; then
    ((node_tests_passed++))
fi
((node_tests_total++))

# Test Node.js non-streaming without redaction
if test_endpoint "Node.js" $NODE_PORT "Non-streaming normal" "$NORMAL_REQUEST" "false"; then
    ((node_tests_passed++))
fi
((node_tests_total++))

# Test Node.js non-streaming with redaction
if test_endpoint "Node.js" $NODE_PORT "Non-streaming redaction" "$SENSITIVE_REQUEST" "true"; then
    ((node_tests_passed++))
fi
((node_tests_total++))

# Test Node.js streaming without redaction
if test_streaming_endpoint "Node.js" $NODE_PORT "Streaming normal" "$NORMAL_STREAM_REQUEST" "false"; then
    ((node_tests_passed++))
fi
((node_tests_total++))

# Test Node.js streaming with redaction
if test_streaming_endpoint "Node.js" $NODE_PORT "Streaming redaction" "$SENSITIVE_STREAM_REQUEST" "true"; then
    ((node_tests_passed++))
fi
((node_tests_total++))

echo -e "\n${BLUE}=== TESTING RUST IMPLEMENTATION ===${NC}"

# Test Rust health
if check_server_health "Rust" $RUST_PORT; then
    ((rust_tests_passed++))
fi
((rust_tests_total++))

# Test Rust non-streaming without redaction
if test_endpoint "Rust" $RUST_PORT "Non-streaming normal" "$NORMAL_REQUEST" "false"; then
    ((rust_tests_passed++))
fi
((rust_tests_total++))

# Test Rust non-streaming with redaction
if test_endpoint "Rust" $RUST_PORT "Non-streaming redaction" "$SENSITIVE_REQUEST" "true"; then
    ((rust_tests_passed++))
fi
((rust_tests_total++))

# Test Rust streaming without redaction
if test_streaming_endpoint "Rust" $RUST_PORT "Streaming normal" "$NORMAL_STREAM_REQUEST" "false"; then
    ((rust_tests_passed++))
fi
((rust_tests_total++))

# Test Rust streaming with redaction
if test_streaming_endpoint "Rust" $RUST_PORT "Streaming redaction" "$SENSITIVE_STREAM_REQUEST" "true"; then
    ((rust_tests_passed++))
fi
((rust_tests_total++))

# Final results
echo -e "\n${BLUE}=== TEST RESULTS ===${NC}"
echo -e "${YELLOW}Node.js Implementation:${NC} $node_tests_passed/$node_tests_total tests passed"
echo -e "${YELLOW}Rust Implementation:${NC} $rust_tests_passed/$rust_tests_total tests passed"

total_passed=$((node_tests_passed + rust_tests_passed))
total_tests=$((node_tests_total + rust_tests_total))

if [[ $total_passed -eq $total_tests ]]; then
    echo -e "${GREEN}🎉 All tests passed! ($total_passed/$total_tests)${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. ($total_passed/$total_tests)${NC}"
    exit 1
fi