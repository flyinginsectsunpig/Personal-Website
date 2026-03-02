export type SentimentResponse = {
  label: string;
  probability: number;
};

export async function predictSentiment(text: string): Promise<SentimentResponse> {
  const response = await fetch("http://localhost:8000/api/v1/ml/sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error(`Sentiment prediction failed: ${response.status}`);
  }

  return response.json();
}
