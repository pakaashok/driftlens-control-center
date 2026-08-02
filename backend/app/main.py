"""
DriftLens Control Center - FastAPI Application
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="DriftLens Control Center",
    description="Mission control for infrastructure drift powered by Jaccard similarity",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration from environment
# In development: allow all origins
# In production: set ALLOWED_ORIGINS env variable
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_env == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to DriftLens Control Center",
        "tagline": "Mission control for infrastructure drift",
        "version": "0.1.0",
        "docs": "/docs",
    }
