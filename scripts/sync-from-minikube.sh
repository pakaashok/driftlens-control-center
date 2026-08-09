#!/bin/bash
# ─────────────────────────────────────────────────────
# DriftLens - Sync LIVE K8s Configs from Minikube
# ─────────────────────────────────────────────────────

set -e

SAMPLES_DIR="/home/istio/driftlens-control-center/samples/kubernetes"

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

  # Pull ONLY sample-app deployment
  kubectl get deployment sample-app \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/deployment.yaml" 2>/dev/null \
    && echo "  ✅ deployment.yaml synced ($(kubectl get deployment sample-app -n $NAMESPACE -o jsonpath='{.spec.replicas}') replicas)" \
    || echo "  ⚠️  No sample-app deployment in $NAMESPACE"

  # Pull sample-app configmap
  kubectl get configmap sample-app-config \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/configmap.yaml" 2>/dev/null \
    && echo "  ✅ configmap.yaml synced" \
    || echo "  ⚠️  No configmap in $NAMESPACE"

  # Pull sample-app service
  kubectl get service sample-app \
    -n "$NAMESPACE" \
    -o yaml > "$ENV_DIR/service.yaml" 2>/dev/null \
    && echo "  ✅ service.yaml synced" \
    || echo "  ⚠️  No service in $NAMESPACE"

  echo ""
done

echo "✅ Sync complete!"
echo ""
echo "📊 Replica counts from K8s:"
echo "  dev:     $(kubectl get deployment sample-app -n development -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo "  staging: $(kubectl get deployment sample-app -n staging -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo "  prod:    $(kubectl get deployment sample-app -n production -o jsonpath='{.spec.replicas}' 2>/dev/null || echo 'N/A')"
echo ""
echo "📊 Replica counts from sample files:"
echo "  dev:     $(grep 'replicas:' $SAMPLES_DIR/dev/deployment.yaml | head -1 | awk '{print $2}' 2>/dev/null || echo 'N/A')"
echo "  staging: $(grep 'replicas:' $SAMPLES_DIR/staging/deployment.yaml | head -1 | awk '{print $2}' 2>/dev/null || echo 'N/A')"
echo "  prod:    $(grep 'replicas:' $SAMPLES_DIR/prod/deployment.yaml | head -1 | awk '{print $2}' 2>/dev/null || echo 'N/A')"
echo ""
echo "🎯 Open DriftLens: http://192.168.29.55:3000"
