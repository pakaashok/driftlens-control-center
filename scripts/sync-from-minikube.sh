#!/bin/bash
# ─────────────────────────────────────────────────────
# DriftLens - Sync LIVE K8s Configs from Minikube
# ─────────────────────────────────────────────────────

set -e

SAMPLES_DIR="$(dirname "$0")/../samples/kubernetes"

echo "🔄 Syncing LIVE configs from Minikube..."
echo ""

declare -A ENV_MAP=(
  ["dev"]="development"
  ["staging"]="staging"
  ["prod"]="production"
)

for ENV_NAME in "${!ENV_MAP[@]}"; do
  NAMESPACE="${ENV_MAP[$ENV_NAME]}"
  ENV_DIR="$SAMPLES_DIR/$ENV_NAME"

  echo "📦 Namespace: $NAMESPACE → $ENV_NAME"
  mkdir -p "$ENV_DIR"

  # Pull sample-app deployment (NOT driftlens!)
  kubectl get deployment sample-app \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/deployment.yaml" 2>/dev/null \
    && echo "  ✅ deployment.yaml synced" \
    || echo "  ⚠️  No sample-app deployment in $NAMESPACE"

  # Pull configmap
  kubectl get configmap sample-app-config \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/configmap.yaml" 2>/dev/null \
    && echo "  ✅ configmap.yaml synced" \
    || echo "  ⚠️  No configmap in $NAMESPACE"

  # Pull service
  kubectl get service sample-app \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/service.yaml" 2>/dev/null \
    && echo "  ✅ service.yaml synced" \
    || echo "  ⚠️  No service in $NAMESPACE"

  echo ""
done

echo "✅ Sync complete!"
echo ""
echo "📊 Replica counts:"
echo "  dev:     $(kubectl get deployment sample-app -n development -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo "  staging: $(kubectl get deployment sample-app -n staging -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo "  prod:    $(kubectl get deployment sample-app -n production -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo ""
echo "🎯 Open DriftLens: http://192.168.29.55:3000"
