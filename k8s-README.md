# 🎯 DriftLens Control Center

> **Mission control for infrastructure drift — powered by Jaccard similarity**

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326CE5)
![Tests](https://img.shields.io/badge/Tests-34%20Passing-success)
![License](https://img.shields.io/badge/License-MIT-yellow)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)

---

## 📖 Table of Contents

- [What is DriftLens?](#-what-is-driftlens-control-center)
- [Architecture](#️-architecture)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Project Journey](#️-project-journey)
- [Docker Commands](#-docker-commands)
- [Kubernetes Commands](#️-kubernetes-commands)
- [GitOps Workflow](#-gitops-workflow)
- [API Reference](#-api-reference)
- [Local Development](#️-local-development)
- [Intentional Drift](#-intentional-drift-between-environments)
- [Tests](#-tests)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [Built With](#-built-with)

---

## 📖 What is DriftLens Control Center?

**DriftLens Control Center** is an open-source infrastructure drift detection tool built for DevOps and Platform Engineering teams.

It detects **configuration drift** across environments (dev, staging, production) using the **Jaccard Similarity algorithm** — showing exactly what changed, what's missing, and how much drift exists between environments.

### 🔬 How Jaccard Similarity Works

Jaccard Similarity = |Intersection| / |Union|Real Example:
Dev tokens:  {replicas=1, image=nginx:1.20, LOG_LEVEL=debug}
Prod tokens: {replicas=3, image=nginx:1.25, LOG_LEVEL=warn, CACHE=true}Intersection = {} = 0 common tokens
Union        = 7 total tokens
Similarity   = 0/7 = 0% → 100% DRIFT! 🚨
---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│                  http://localhost:3000                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          Frontend Container (Next.js + shadcn/ui)           │
│  ├── Dark themed dashboard                                  │
│  ├── Environment selector                                   │
│  ├── KPI Cards (Similarity, Drift, Tokens)                  │
│  └── Token diff panels                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend Container (FastAPI)                  │
│  ├── GET /api/environments                                  │
│  ├── GET /api/kubernetes/compare                            │
│  ├── GET /api/kubernetes/matrix                             │
│  └── GET /api/health                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Core Engine (Python)                       │
│  ├── Jaccard Similarity Algorithm                           │
│  ├── YAML/JSON/ENV Tokenizer                                │
│  └── Kubernetes Drift Detector                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ reads
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Live Data (Minikube)                       │
│  ├── namespace: development  (replicas: 1)                  │
│  ├── namespace: staging      (replicas: 2)                  │
│  └── namespace: production   (replicas: 3)                  │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ kubectl apply
┌─────────────────────────────────────────────────────────────┐
│                GitOps (GitHub Actions)                      │
│  ├── Push to main branch                                    │
│  ├── Self-hosted runner on istio-lab                        │
│  ├── kubectl apply -k k8s/sample-app/overlays/              │
│  └── Auto-sync DriftLens samples                            │
└─────────────────────────────────────────────────────────────┘
✨ FeaturesFeatureDescription🔍 Drift DetectionCompare K8s manifests across environments📊 Jaccard ScoringMathematical similarity percentage🎨 Beautiful UIDark-themed Next.js dashboard🌡️ Drift ClassificationNO DRIFT / MINOR / MODERATE / CRITICAL📋 Token AnalysisSee exactly what tokens changed🐳 Docker ReadyOne command deployment☸️  Kubernetes NativeKustomize overlays per environment🤖 GitOpsAuto-deploy via GitHub Actions👀 Auto-SyncPython watcher detects K8s changes🔌 REST APIFastAPI with Swagger UI🧪 Well Tested34 tests passing🚀 Quick StartPrerequisites
Docker + Docker Compose
One Command!git clone https://github.com/pakaashok/driftlens-control-center.git
cd driftlens-control-center
docker-compose up -d
Open: http://localhost:3000 🎉📁 Project Structuredriftlens-control-center/
│
├── 🐳 docker-compose.yml              # One command deployment
├── 📋 Makefile                        # All useful commands
├── 📝 README.md                       # This file
│
├── backend/                           # Python FastAPI
│   ├── Dockerfile                     # Python 3.12-slim
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       │   ├── jaccard.py             # Jaccard algorithm
│       │   └── tokenizer.py           # YAML/JSON/ENV tokenizer
│       ├── modules/
│       │   └── kubernetes.py          # K8s drift detector
│       ├── api/
│       │   └── routes.py              # REST endpoints
│       ├── models/
│       │   └── schemas.py             # Pydantic models
│       └── main.py                    # FastAPI app + CORS
│
├── frontend/                          # Next.js Dashboard
│   ├── Dockerfile                     # Node 20-alpine multi-stage
│   ├── app/
│   │   └── page.tsx                   # Main dashboard page
│   ├── components/
│   │   └── dashboard/
│   │       ├── Header.tsx             # App header
│   │       ├── EnvSelector.tsx        # Environment picker
│   │       ├── KPICards.tsx           # Metric cards
│   │       ├── TokenPanel.tsx         # Token diff panels
│   │       └── EmptyState.tsx         # Ready state
│   └── lib/
│       └── api.ts                     # API client
│
├── k8s/                               # Kubernetes manifests
│   ├── namespaces/                    # Namespace definitions
│   │   ├── development.yaml
│   │   ├── staging.yaml
│   │   └── production.yaml
│   └── sample-app/                    # Sample app (Kustomize)
│       ├── base/                      # Common config
│       │   ├── deployment.yaml
│       │   ├── service.yaml
│       │   ├── configmap.yaml
│       │   └── kustomization.yaml
│       └── overlays/                  # Per-environment overrides
│           ├── dev/                   # replicas:1, nginx:1.20
│           ├── staging/               # replicas:2, nginx:1.22
│           └── prod/                  # replicas:3, nginx:1.25
│
├── samples/                           # Live synced K8s configs
│   └── kubernetes/
│       ├── dev/                       # Synced from development ns
│       ├── staging/                   # Synced from staging ns
│       └── prod/                      # Synced from production ns
│
├── scripts/
│   ├── sync-from-minikube.sh          # Sync live K8s configs
│   ├── watch-and-sync.sh              # Auto-watch for changes
│   └── k8s-watcher.py                 # Python K8s watcher
│
├── backend/tests/
│   ├── test_jaccard.py                # 17 Jaccard tests
│   └── test_tokenizer.py              # 17 Tokenizer tests
│
└── .github/
    └── workflows/
        └── deploy.yml                 # GitHub Actions CI/CD
🗺️ Project Journey✅ Phase 1: Core Engine + DashboardBuilt the core drift detection engine and REST API:What we built:
├── Jaccard similarity engine     (jaccard.py)
├── Multi-format tokenizer        (tokenizer.py)
│   ├── YAML tokenization
│   ├── JSON tokenization
│   └── ENV file tokenization
├── Kubernetes drift detector     (kubernetes.py)
├── FastAPI REST API               (routes.py)
├── Next.js dark dashboard
│   ├── Environment selector
│   ├── KPI cards (Similarity/Drift/Tokens)
│   └── Token diff panels
└── 34 unit tests passing

Key Result:
  Compare dev vs prod → See 73% drift instantly!
✅ Phase 2: DockerizationContainerized the entire application:What we built:
├── Backend Dockerfile             (Python 3.12-slim)
├── Frontend Dockerfile            (Node 20-alpine)
│   └── Multi-stage build for small image
├── docker-compose.yml
│   ├── Health checks
│   ├── Volume mounts for samples
│   └── Network configuration
├── .dockerignore files
└── Pushed to Docker Hub
    ├── yourusername/driftlens-backend:latest
    └── yourusername/driftlens-frontend:latest

Key Result:
  docker-compose up -d → Everything runs!
  Works on any machine!
✅ Phase 3: Kubernetes + GitOpsReal Kubernetes integration with automated drift detection:What we built:
├── Minikube cluster with 3 namespaces
│   ├── development  (replicas: 1)
│   ├── staging      (replicas: 2)
│   └── production   (replicas: 3)
├── Kustomize overlays per environment
│   ├── Different replicas
│   ├── Different images
│   ├── Different resource limits
│   └── Different environment variables
├── Auto-sync scripts
│   ├── sync-from-minikube.sh
│   ├── watch-and-sync.sh
│   └── k8s-watcher.py (Python)
└── GitHub Actions GitOps
    ├── Self-hosted runner on istio-lab
    ├── Auto-deploy on k8s/** changes
    ├── Wait for rollout completion
    └── Auto-sync DriftLens

Key Result:
  git push → Auto-deploy → Auto-sync → Dashboard updates!
  Zero manual steps!
🐳 Docker Commands# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Check status
docker-compose ps
☸️ Kubernetes Commands# Deploy all environments
make k8s-deploy-all

# Deploy specific environment
make k8s-deploy-dev
make k8s-deploy-staging
make k8s-deploy-prod

# Check status
make k8s-status

# Sync live configs to DriftLens
make sync-minikube

# Start auto-watcher
make watch
🤖 GitOps Workflow1. Edit K8s config:
   vim k8s/sample-app/overlays/prod/patch.yaml

2. Commit and push:
   git add . && git commit -m "Scale prod" && git push

3. GitHub Actions triggers automatically:
   ✅ kubectl apply to all namespaces
   ✅ Wait for rollout
   ✅ Sync DriftLens samples
   ✅ Dashboard updates!
🔌 API ReferenceList EnvironmentsGET /api/environments
{
  "environments": ["dev", "staging", "prod"],
  "count": 3
}
Compare EnvironmentsGET /api/kubernetes/compare?env_a=dev&env_b=prod
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
    "only_in_a": ["spec.replicas=1", "..."],
    "only_in_b": ["spec.replicas=3", "..."],
    "common": ["metadata.name=sample-app", "..."]
  }
}
Similarity MatrixGET /api/kubernetes/matrix
{
  "environments": ["dev", "staging", "prod"],
  "matrix": {
    "dev":     {"dev": 1.0, "staging": 0.72, "prod": 0.54},
    "staging": {"dev": 0.72, "staging": 1.0,  "prod": 0.61},
    "prod":    {"dev": 0.54, "staging": 0.61, "prod": 1.0}
  }
}
Interactive Docshttp://localhost:8000/docs
🛠️ Local DevelopmentBackendcd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Frontendcd frontend
cp .env.example .env.local
npm install
npm run dev
Run Testscd backend
source venv/bin/activate
pytest tests/ -v

# Output:
# test_jaccard.py    17 passed ✅
# test_tokenizer.py  17 passed ✅
# Total: 34 passed  ✅
📊 Intentional Drift Between EnvironmentsConfigDevStagingProdReplicas123Imagenginx:1.20nginx:1.22nginx:1.25LOG_LEVELdebuginfowarnCACHE_ENABLEDfalsetruetrueMAX_CONNECTIONS1050200TIMEOUT3060120VERSION1.0.01.1.01.0.5🧪 Testsbackend/tests/
├── test_jaccard.py     # 17 tests
│   ├── identical sets → 1.0
│   ├── disjoint sets  → 0.0
│   ├── partial overlap → correct ratio
│   ├── empty sets     → 1.0
│   └── edge cases...
└── test_tokenizer.py   # 17 tests
    ├── YAML tokenization
    ├── JSON tokenization
    ├── ENV file tokenization
    └── edge cases...

Total: 34 tests, all passing ✅
🗺️ Roadmap
 Phase 1: Core Engine + REST API + Dashboard
 Phase 2: Docker deployment
 Phase 3: Kubernetes + GitOps
 Phase 4: File Upload (drag & drop YAMLs)
 Phase 5: Git repository integration
 Phase 6: AWS ECS deployment
 Phase 7: kubectl live cluster connection
 Phase 8: Slack/email drift alerts
 Phase 9: Historical drift tracking
 Phase 10: Terraform drift detection


## 👨‍💻 Built With

| Technology | Purpose |
|---|---|
| Python 3.12 | Backend language |
| FastAPI | REST API framework |
| Pydantic | Data validation |
| PyYAML | YAML parsing |
| Next.js 16 | Frontend framework |
| shadcn/ui | UI components |
| Tailwind CSS | Styling |
| TypeScript | Type safety |
| Docker | Containerization |
| Kubernetes | Container orchestration |
| Kustomize | K8s config management |
| GitHub Actions | CI/CD pipeline |
| Jaccard Similarity | Core drift algorithm |
