#!/bin/bash
# ─────────────────────────────────────────────────────
# DriftLens - Sync Live K8s Configs from Minikube
# Usage: ./scripts/sync-from-minikube.sh
# ─────────────────────────────────────────────────────

set -e

SAMPLES_DIR="./samples/kubernetes"

echo "🔄 Syncing live configs from Minikube..."
echo ""

declare -A ENV_MAP=(
  ["dev"]="development"
  ["staging"]="staging"
  ["prod"]="production"
)

for ENV_NAME in "${!ENV_MAP[@]}"; do
  NAMESPACE="${ENV_MAP[$ENV_NAME]}"
  ENV_DIR="$SAMPLES_DIR/$ENV_NAME"

  echo "📦 Pulling namespace: $NAMESPACE → $ENV_NAME"
  mkdir -p "$ENV_DIR"

  # Pull deployment
  kubectl get deployment driftlens \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/deployment.yaml" 2>/dev/null \
    && echo "  ✅ deployment.yaml" \
    || echo "  ⚠️  No deployment found"

  # Pull service
  kubectl get service driftlens-backend \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/service.yaml" 2>/dev/null \
    && echo "  ✅ service.yaml" \
    || echo "  ⚠️  No service found"

done

echo ""
echo "✅ Sync complete! Files updated:"
find $SAMPLES_DIR -name "*.yaml" | sort
echo ""
echo "🎯 Open DriftLens dashboard to see real drift!"
echo "   http://192.168.29.55:3000"
