SHELL := /bin/bash
.PHONY: backend frontend kill-backend kill-frontend kill-all status test

backend:
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm run dev

kill-backend:
	@lsof -ti:8000 | xargs kill -9 2>/dev/null && echo "✅ Backend stopped" || echo "ℹ️  Port 8000 already free"

kill-frontend:
	@lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Frontend stopped" || echo "ℹ️  Port 3000 already free"

kill-all: kill-backend kill-frontend
	@echo "✅ All ports cleared!"

status:
	@echo "=== Backend (Port 8000) ==="
	@curl -s http://localhost:8000/ > /dev/null 2>&1 && echo "✅ RUNNING" || echo "❌ STOPPED"
	@echo "=== Frontend (Port 3000) ==="
	@curl -s http://localhost:3000/ > /dev/null 2>&1 && echo "✅ RUNNING" || echo "❌ STOPPED"

test:
	cd backend && . venv/bin/activate && pytest tests/ -v

restart: kill-all
	@echo "Ports cleared. Start backend and frontend manually."

# ── Kubernetes / Minikube ─────────────────────────────────────
k8s-deploy-dev:
	kubectl apply -k k8s/overlays/dev/
	@echo "✅ Deployed to development namespace"

k8s-deploy-staging:
	kubectl apply -k k8s/overlays/staging/
	@echo "✅ Deployed to staging namespace"

k8s-deploy-prod:
	kubectl apply -k k8s/overlays/prod/
	@echo "✅ Deployed to production namespace"

k8s-deploy-all: k8s-deploy-dev k8s-deploy-staging k8s-deploy-prod
	@echo "✅ Deployed to ALL namespaces!"

k8s-status:
	@echo "=== Development ==="
	@kubectl get pods -n development
	@echo "=== Staging ==="
	@kubectl get pods -n staging
	@echo "=== Production ==="
	@kubectl get pods -n production

sync-minikube:
	@echo "🔄 Syncing from Minikube..."
	@./scripts/sync-from-minikube.sh

load-images:
	@echo "📦 Loading images into Minikube..."
	minikube image load driftlens-control-center-backend:latest
	minikube image load driftlens-control-center-frontend:latest
	@echo "✅ Images loaded!"

drift-check:
	@echo "🔄 Syncing from Minikube..."
	@./scripts/sync-from-minikube.sh
	@echo "🎯 Check dashboard: http://192.168.29.55:3000"
