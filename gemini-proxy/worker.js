/**
 * Cloudflare Worker — Gemini API Proxy
 * ------------------------------------
 * Keeps GEMINI_API_KEY out of the browser entirely.
 * The key lives as a Worker secret (never in source code).
 *
 * Deploy steps:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. cd gemini-proxy
 *   4. wrangler secret put GEMINI_API_KEY   ← paste your key when prompted
 *   5. wrangler deploy
 *
 * After deploying, copy the worker URL (e.g. https://gemini-proxy.YOUR-NAME.workers.dev)
 * into GEMINI_PROXY_URL in index.html and delete GEMINI_API_KEY from that file.
 */

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Allowed origins — add your GitHub Pages URL here
const ALLOWED_ORIGINS = [
  'http://localhost',
  'http://127.0.0.1',
  'https://flyinginsectsunpig.github.io/Personal-Website/', 
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    // ── Only accept POST ────────────────────────────────────────────────────
    if (request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'Method not allowed' }), 405, origin);
    }

    // ── Parse request body ──────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: 'Invalid JSON' }), 400, origin);
    }

    // ── Forward to Gemini with secret key ───────────────────────────────────
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await geminiRes.json();
    return corsResponse(JSON.stringify(data), geminiRes.status, origin);
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin':  allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function corsResponse(body, status, origin) {
  return new Response(body, { status, headers: corsHeaders(origin) });
}
