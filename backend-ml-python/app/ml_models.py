from dataclasses import dataclass

import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


@dataclass
class ModelBundle:
    sentiment_pipeline: Pipeline
    regression_model: RandomForestRegressor
    regression_feature_count: int


def train_models() -> ModelBundle:
    sentiment_texts = [
        "This is amazing and very useful",
        "Excellent architecture and clean implementation",
        "I am disappointed and frustrated",
        "The system is broken and slow",
        "Great user interface and smooth experience",
        "Terrible error handling and poor design",
    ]
    sentiment_labels = ["positive", "positive", "negative", "negative", "positive", "negative"]

    sentiment_pipeline = Pipeline(
        [
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ("clf", LogisticRegression(max_iter=300)),
        ]
    )
    sentiment_pipeline.fit(sentiment_texts, sentiment_labels)

    diabetes = load_diabetes()
    x = diabetes.data
    y = diabetes.target
    regressor = RandomForestRegressor(n_estimators=150, random_state=42)
    regressor.fit(x, y)

    return ModelBundle(
        sentiment_pipeline=sentiment_pipeline,
        regression_model=regressor,
        regression_feature_count=x.shape[1],
    )


def predict_sentiment(bundle: ModelBundle, text: str) -> tuple[str, float]:
    label = bundle.sentiment_pipeline.predict([text])[0]
    probabilities = bundle.sentiment_pipeline.predict_proba([text])[0]
    class_index = int(np.argmax(probabilities))
    return str(label), float(probabilities[class_index])


def predict_regression(bundle: ModelBundle, features: list[float]) -> float:
    arr = np.array(features, dtype=np.float64).reshape(1, -1)
    return float(bundle.regression_model.predict(arr)[0])
