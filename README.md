Create the Complete README.md
bash
cat > ~/driftlens-control-center/README.md << 'EOF'
# 🎯 DriftLens Control Center

> **Mission control for infrastructure drift — powered by Jaccard similarity**

![DriftLens Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.1.0-009688)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Tests](https://img.shields.io/badge/Tests-34%20Passing-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 What is DriftLens Control Center?

**DriftLens Control Center** is an infrastructure drift detection tool that helps DevOps and Platform Engineering teams identify configuration differences across environments (dev, staging, production).

### 🔬 How It Works

DriftLens uses the **Jaccard Similarity algorithm** to compare infrastructure
configurations:

Jaccard Similarity = |Intersection| / |Union|

**Example:**
Dev tokens:  {replicas=2, image=nginx:1.20, port=80}
Prod tokens: {replicas=10, image=nginx:1.25, port=80, nodeSelector=prod}

Intersection = {port=80} = 1
Union        = 4 tokens
Similarity   = 1/4 = 25% → 75% DRIFT DETECTED! 🚨

yaml

---

## ✨ Features

- 🔍 **Drift Detection** — Compare Kubernetes manifests across environments
- 📊 **Similarity Scoring** — Jaccard-based percentage scoring
- 🎨 **Beautiful Dashboard** — Dark-themed Next.js UI
- 🌡️ **Drift Classification** — NO DRIFT / MINOR / MODERATE / CRITICAL
- 📋 **Token Analysis** — See exactly what changed
- 🐳 **Docker Ready** — One command deployment
- 🔌 **REST API** — FastAPI with Swagger UI
- 🧪 **Well Tested** — 34 tests passing

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose

### One Command Start

```bash
git clone https://github.com/pakaashok/driftlens-control-center
cd driftlens-control-center
docker-compose up -d
Open browser: http://localhost:3000 🎉

Stop
bash
docker-compose down

🖥️ Screenshots

Dashboard — Ready State
css
┌─────────────────────────────────────────────────────────┐
│  🎯 DriftLens Control Center                   v0.1.0   
├─────────────────────────────────────────────────────────┤
│  Compare Environments                                   │
│  [ dev ▼ ]  vs  [ prod ▼ ]    [▶ Analyze Drift]        |
│                                                         │
│  ⚡ Ready to Analyze                                   │
│  Select two environments and click Analyze Drift        │
└─────────────────────────────────────────────────────────┘

Dashboard — Results
sql
┌─────────────────────────────────────────────────────────┐
│  Similarity    Drift       Common     Total             │
│  26.3% 🔴      73.7%       10         38                |
│               🚨 CRITICAL DRIFT                         │
├──────────────────────┬──────────────────────────────────┤
│  Only in dev         │  Only in prod                    │
│  spec.replicas=2     │  spec.replicas=10                │
│  image=nginx:1.20    │  image=nginx:1.25                │
│  LOG_LEVEL=debug     │  LOG_LEVEL=warn                  │
│                      │  nodeSelector=production         │
│                      │  CACHE_ENABLED=true              │
└──────────────────────┴──────────────────────────────────┘

🏗️ Architecture
bash
┌─────────────────────────────────────────────────────────┐
│                    Browser                              │
│              http://localhost:3000                      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Frontend (Next.js + shadcn/ui)                │
│  ├── Dashboard Page                                     │
│  ├── KPI Cards                                          │
│  ├── Environment Selector                               │
│  └── Token Diff Panels                                  │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (FastAPI)                          │
│  ├── GET /api/environments                              │
│  ├── GET /api/kubernetes/compare                        │
│  └── GET /api/kubernetes/matrix                         │
└──────────────────────┬──────────────────────────────────┘
                       │ Python
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Core Engine                                   │
│  ├── Jaccard Similarity Algorithm                       │
│  ├── YAML/JSON/ENV Tokenizer                            │
│  └── Kubernetes Drift Detector                          │
└──────────────────────┬──────────────────────────────────┘
                       │ reads
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Sample Data                                   │
│  └── samples/kubernetes/                                │
│      ├── dev/deployment.yaml                            │
│      ├── staging/deployment.yaml                        │
│      └── prod/deployment.yaml                           │
└─────────────────────────────────────────────────────────┘

📁 Project Structure
r
driftlens-control-center/
├── 🐳 docker-compose.yml          # One command deployment
├── 📋 Makefile                    # Handy shortcuts
├── 📝 README.md                   # This file
│
├── backend/                       # Python FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       │   ├── jaccard.py         # Jaccard similarity engine
│       │   └── tokenizer.py       # YAML/JSON/ENV tokenizer
│       ├── modules/
│       │   └── kubernetes.py      # K8s drift detector
│       ├── api/
│       │   └── routes.py          # REST endpoints
│       ├── models/
│       │   └── schemas.py         # Pydantic models
│       └── main.py                # FastAPI app
│
├── frontend/                      # Next.js Dashboard
│   ├── Dockerfile
│   ├── app/
│   │   └── page.tsx               # Main dashboard
│   ├── components/
│   │   └── dashboard/
│   │       ├── Header.tsx
│   │       ├── EnvSelector.tsx
│   │       ├── KPICards.tsx
│   │       ├── TokenPanel.tsx
│   │       └── EmptyState.tsx
│   └── lib/
│       └── api.ts                 # API client
│
└── samples/                       # Sample K8s manifests
    └── kubernetes/
        ├── dev/
        │   └── deployment.yaml    # replicas: 2, nginx:1.20
        ├── staging/
        │   └── deployment.yaml    # replicas: 3, nginx:1.21
        └── prod/
            └── deployment.yaml    # replicas: 10, nginx:1.25

🔌 API Reference
List Environments
bash
GET /api/environments

Response:
{
  "environments": ["dev", "staging", "prod"],
  "count": 3
}
Compare Environments
bash
GET /api/kubernetes/compare?env_a=dev&env_b=prod

Response:
{
  "environment_a": "dev",
  "environment_b": "prod",
  "overall": {
    "similarity_score": 0.263,
    "similarity_percentage": 26.3,
    "drift_percentage": 73.7,
    "drift_detected": true,
    "intersection_size": 10,
    "union_size": 38,
    "only_in_a": ["spec.replicas=2", "..."],
    "only_in_b": ["spec.replicas=10", "..."],
    "common": ["spec.port=80", "..."]
  }
}
Similarity Matrix
bash
GET /api/kubernetes/matrix

Response:
{
  "environments": ["dev", "staging", "prod"],
  "matrix": {
    "dev":     {"dev": 1.0, "staging": 0.72, "prod": 0.26},
    "staging": {"dev": 0.72, "staging": 1.0, "prod": 0.31},
    "prod":    {"dev": 0.26, "staging": 0.31, "prod": 1.0}
  }
}
Interactive API Docs
bash
http://localhost:8000/docs
🛠️ Local Development (Without Docker)
Backend
bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontend
bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
Run Tests
bash
cd backend
source venv/bin/activate
pytest tests/ -v

# 34 tests passing ✅
🧪 Tests
python
backend/tests/
├── test_jaccard.py     # 17 tests - Jaccard similarity engine
└── test_tokenizer.py   # 17 tests - Tokenizer module

Total: 34 tests, all passing ✅
Run tests:

bash
cd backend
source venv/bin/activate
pytest tests/ -v

🐳 Docker Commands
bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Check status
docker-compose ps

🗺️ Roadmap
 Phase 1: Core engine + REST API + Dashboard
 Phase 2: Docker deployment
 Phase 3: AWS deployment (EC2/ECS)
 Terraform drift detection
 Helm chart support
 Slack/email alerts
 Historical drift tracking
 Multi-cluster support

🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

👨‍💻 Built With
Technology	Purpose
Python 3.12	Backend language
FastAPI	REST API framework
Pydantic	Data validation
PyYAML	YAML parsing
Next.js 16	Frontend framework
shadcn/ui	UI components
Tailwind CSS	Styling
TypeScript	Type safety
Docker	Containerization
Jaccard Similarity	Drift algorithm


✅ Verify README
bash
wc -l ~/driftlens-control-center/README.md
