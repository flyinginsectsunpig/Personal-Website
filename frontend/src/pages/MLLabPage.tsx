import CodePanel from "../components/CodePanel";
import { predictSentiment } from "../api/clients";
import React, { useState } from "react";
import { motion } from "framer-motion";

const sentimentControllerSample = `@PostMapping("/sentiment")
public SentimentResponse predict(@Valid @RequestBody SentimentRequest request) {
    return mlClient.predictSentiment(request);
}`;

export default function MLLabPage() {
  const [input, setInput] = useState("This project is robust and useful.");
  const [result, setResult] = useState<string>("");
  const [probability, setProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const onPredict = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await predictSentiment(input);
      setResult(response.label);
      setProbability(response.probability);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="card">
        <h1>Machine Learning Lab</h1>
        <p>
          Live sentiment classification using a trained scikit-learn logistic regression model in the
          FastAPI microservice.
        </p>
        <label htmlFor="sentiment-input">Input text</label>
        <textarea
          id="sentiment-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <div className="button-row">
          <button className="button" onClick={onPredict} disabled={loading}>
            {loading ? "Predicting..." : "Run Prediction"}
          </button>
          <button className="button secondary" onClick={() => setShowCode((v) => !v)}>
            See Backend Code
          </button>
          <button className="button secondary" onClick={() => setShowArchitecture((v) => !v)}>
            View Architecture
          </button>
          <a className="button secondary" href="https://github.com/" target="_blank" rel="noreferrer">
            Open GitHub Repo
          </a>
        </div>
        {error && <p className="error">{error}</p>}
        {result && (
          <motion.div
            className="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>
              Prediction: <strong>{result}</strong>
            </p>
            {probability !== null && <p>Probability: {(probability * 100).toFixed(2)}%</p>}
          </motion.div>
        )}
      </section>
      {showCode && <CodePanel title="Spring Controller Sample" code={sentimentControllerSample} />}
      {showArchitecture && (
        <section className="card">
          <h3>ML Pipeline</h3>
          <p>UI -&gt; FastAPI /api/v1/ml/sentiment -&gt; TF-IDF Vectorizer -&gt; LogisticRegression -&gt; JSON</p>
        </section>
      )}
    </div>
  );
}
