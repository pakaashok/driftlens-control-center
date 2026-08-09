# ── Kubernetes ────────────────────────────────────────────────
k8s-namespaces:
	@echo "Creating namespaces..."
	kubectl apply -f k8s/namespaces/
	@echo "✅ Namespaces created!"

k8s-deploy-dev:
	kubectl apply -k k8s/sample-app/overlays/dev/
	@echo "✅ Deployed to development"

k8s-deploy-staging:
	kubectl apply -k k8s/sample-app/overlays/staging/
	@echo "✅ Deployed to staging"

k8s-deploy-prod:
	kubectl apply -k k8s/sample-app/overlays/prod/
	@echo "✅ Deployed to production"

k8s-deploy-all: k8s-namespaces k8s-deploy-dev k8s-deploy-staging k8s-deploy-prod
	@echo "✅ Deployed to ALL environments!"

k8s-status:
	@echo "=== Namespaces ==="
	@kubectl get namespaces | grep -E "development|staging|production"
	@echo "=== Development ==="
	@kubectl get pods,deployments,configmaps -n development
	@echo "=== Staging ==="
	@kubectl get pods,deployments,configmaps -n staging
	@echo "=== Production ==="
	@kubectl get pods,deployments,configmaps -n production

k8s-delete-all:
	@kubectl delete -k k8s/sample-app/overlays/dev/ 2>/dev/null || true
	@kubectl delete -k k8s/sample-app/overlays/staging/ 2>/dev/null || true
	@kubectl delete -k k8s/sample-app/overlays/prod/ 2>/dev/null || true
	@echo "✅ All deployments removed!"

sync-minikube:
	@echo "🔄 Syncing from Minikube..."
	@./scripts/sync-from-minikube.sh

drift-check: sync-minikube
	@echo "🎯 Dashboard: http://192.168.29.55:3000"

load-images:
	@echo "Loading images into Minikube..."
	minikube image load driftlens-control-center-backend:latest
	minikube image load driftlens-control-center-frontend:latest
	@echo "✅ Images loaded!"
	
# ── Auto Sync ─────────────────────────────────────────────────
watch:
	@echo "👀 Starting K8s watcher..."
	@python3 scripts/k8s-watcher.py

watch-simple:
	@echo "👀 Starting simple watch (30s interval)..."
	@./scripts/watch-and-sync.sh 30

watch-fast:
	@echo "👀 Starting fast watch (10s interval)..."
	@./scripts/watch-and-sync.sh 10
