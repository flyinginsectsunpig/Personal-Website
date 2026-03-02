from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.ml_models import predict_regression, predict_sentiment, train_models
from app.schemas import (
    RegressionRequest,
    RegressionResponse,
    SentimentRequest,
    SentimentResponse,
)

app = FastAPI(title="Portfolio ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

models = train_models()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/ml/sentiment", response_model=SentimentResponse)
def sentiment(payload: SentimentRequest) -> SentimentResponse:
    label, probability = predict_sentiment(models, payload.text)
    return SentimentResponse(label=label, probability=probability)


@app.post("/api/v1/ml/regression", response_model=RegressionResponse)
def regression(payload: RegressionRequest) -> RegressionResponse:
    if len(payload.features) != models.regression_feature_count:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {models.regression_feature_count} features, got {len(payload.features)}",
        )
    return RegressionResponse(prediction=predict_regression(models, payload.features))
