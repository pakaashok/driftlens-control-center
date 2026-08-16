"""
DriftLens Control Center - API Routes
REST endpoints for drift detection.
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    HealthResponse,
    EnvironmentListResponse,
    DriftComparisonResponse,
    SimilarityMatrixResponse,
)
from app.modules.kubernetes import KubernetesDriftDetector

router = APIRouter(prefix="/api", tags=["Drift Detection"])
k8s_detector = KubernetesDriftDetector()


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint."""
    return HealthResponse()


@router.get("/environments", response_model=EnvironmentListResponse)
def list_environments():
    """List all available Kubernetes environments."""
    envs = k8s_detector.list_environments()
    return EnvironmentListResponse(
        environments=envs,
        count=len(envs),
    )


@router.get("/kubernetes/compare", response_model=DriftComparisonResponse)
def compare_environments(
    env_a: str = Query(..., description="First environment"),
    env_b: str = Query(..., description="Second environment"),
    mode: str = Query("full", description="full or keys_only"),
):
    """Compare two Kubernetes environments for drift."""
    try:
        report = k8s_detector.compare_environments(env_a, env_b, mode)
        return report
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/kubernetes/matrix", response_model=SimilarityMatrixResponse)
def similarity_matrix():
    """Get similarity matrix across all environments."""
    try:
        envs = k8s_detector.list_environments()
        matrix = k8s_detector.similarity_matrix_all_envs()
        return SimilarityMatrixResponse(
            environments=envs,
            matrix=matrix,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matrix generation failed: {str(e)}")
