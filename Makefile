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
