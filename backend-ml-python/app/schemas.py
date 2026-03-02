from pydantic import BaseModel, Field


class SentimentRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class SentimentResponse(BaseModel):
    label: str
    probability: float


class RegressionRequest(BaseModel):
    features: list[float]


class RegressionResponse(BaseModel):
    prediction: float
