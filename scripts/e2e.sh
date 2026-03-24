#!/usr/bin/env bash
set -e

# -------------------------------
# Apply OpenTofu stack
# -------------------------------
echo "Applying OpenTofu stack..."
tofu apply -auto-approve

# -------------------------------
# Extract outputs
# -------------------------------
echo "Fetching OpenTofu outputs..."
USER_POOL_ID=$(tofu output -raw user_pool_id)
USER_POOL_CLIENT_ID=$(tofu output -raw user_pool_client_id)
IDENTITY_POOL_ID=$(tofu output -raw identity_pool_id)

# -------------------------------
# Export as environment variables
# -------------------------------
export NEXT_PUBLIC_AWS_USER_POOL_ID="$USER_POOL_ID"
export NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID="$USER_POOL_CLIENT_ID"
export NEXT_PUBLIC_AWS_IDENTITY_POOL_ID="$IDENTITY_POOL_ID"

echo "Environment variables set:"
echo "USER_POOL_ID=$USER_POOL_ID"
echo "USER_POOL_CLIENT_ID=$USER_POOL_CLIENT_ID"
echo "IDENTITY_POOL_ID=$IDENTITY_POOL_ID"

# -------------------------------
# Run Vitest E2E tests
# -------------------------------
echo "Running E2E tests..."
npx vitest run
