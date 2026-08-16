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


@router.get("/kubernetes/deep-compare")
def deep_compare_environments(
    env_a: str = Query(..., description="First environment"),
    env_b: str = Query(..., description="Second environment"),
):
    """
    Deep comparison using Jaccard + Cosine algorithms.

    Returns:
    - Jaccard score: Key presence drift
    - Cosine score:  Value similarity drift
    - Combined score: Overall drift analysis
    - Recommendations: What to fix
    """
    try:
        from app.core.cosine import CosineEngine
        from app.core.combined import CombinedScorer
        from app.core.tokenizer import Tokenizer

        # Load manifests
        manifests_a = k8s_detector.load_environment(env_a)
        manifests_b = k8s_detector.load_environment(env_b)

        # Build config dicts from tokens
        config_a = {}
        config_b = {}

        for content in manifests_a.values():
            tokens = Tokenizer.tokenize_yaml(content)
            for token in tokens:
                if "=" in token:
                    key, val = token.split("=", 1)
                    config_a[key.strip()] = val.strip()

        for content in manifests_b.values():
            tokens = Tokenizer.tokenize_yaml(content)
            for token in tokens:
                if "=" in token:
                    key, val = token.split("=", 1)
                    config_b[key.strip()] = val.strip()

        # Run combined analysis
        result = CombinedScorer.compare(
            config_a=config_a,
            config_b=config_b,
        )

        return {
            "environment_a": env_a,
            "environment_b": env_b,
            "total_keys_a": len(config_a),
            "total_keys_b": len(config_b),
            "analysis": result.to_dict(),
        }

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Deep analysis failed: {str(e)}"
        )


@router.get("/kubernetes/deep-compare-filtered")
def deep_compare_filtered(
    env_a: str = Query(..., description="First environment"),
    env_b: str = Query(..., description="Second environment"),
):
    """
    Deep comparison with K8s noise filtered out.
    Shows only meaningful config differences.
    """
    try:
        from app.core.cosine import CosineEngine
        from app.core.combined import CombinedScorer
        from app.core.tokenizer import Tokenizer
        from app.core.k8s_filter import filter_config, \
            get_meaningful_differences

        # Load manifests
        manifests_a = k8s_detector.load_environment(env_a)
        manifests_b = k8s_detector.load_environment(env_b)

        # Build config dicts
        raw_config_a = {}
        raw_config_b = {}

        for content in manifests_a.values():
            tokens = Tokenizer.tokenize_yaml(content)
            for token in tokens:
                if "=" in token:
                    key, val = token.split("=", 1)
                    raw_config_a[key.strip()] = val.strip()

        for content in manifests_b.values():
            tokens = Tokenizer.tokenize_yaml(content)
            for token in tokens:
                if "=" in token:
                    key, val = token.split("=", 1)
                    raw_config_b[key.strip()] = val.strip()

        # Filter K8s noise
        config_a = filter_config(raw_config_a)
        config_b = filter_config(raw_config_b)

        # Run combined analysis
        result = CombinedScorer.compare(
            config_a=config_a,
            config_b=config_b,
        )

        # Filter noise from value differences
        result.value_differences = get_meaningful_differences(
            result.value_differences
        )

        return {
            "environment_a": env_a,
            "environment_b": env_b,
            "total_keys_a": len(config_a),
            "total_keys_b": len(config_b),
            "noise_filtered": True,
            "analysis": result.to_dict(),
        }

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Deep analysis failed: {str(e)}"
        )
