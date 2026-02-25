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

// Every origin allowed to call this worker.
// 'null' = local file:// development (the Origin header is literally the string "null")
const ALLOWED_ORIGINS = [
  'null',                                        // file:// local dev
  'http://localhost',
  'http://localhost:3000',
  'http://127.0.0.1',
  'https://flyinginsectsunpig.github.io',        // GitHub Pages — corrected domain
];

export default {
  async fetch(request, env) {
    const origin    = request.headers.get('Origin') ?? '';
    const isAllowed = ALLOWED_ORIGINS.some(o => origin === o || origin.startsWith(o));

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      if (!isAllowed) return new Response('Forbidden', { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ── Block unknown origins early ─────────────────────────────────────────
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Only accept POST ────────────────────────────────────────────────────
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    // ── Parse request body ──────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    // ── Forward to Gemini with secret key ───────────────────────────────────
    let geminiRes;
    try {
      geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to reach Gemini API' }), {
        status: 502,
        headers: corsHeaders(origin),
      });
    }

    const data = await geminiRes.json();
    return new Response(JSON.stringify(data), {
      status:  geminiRes.status,
      headers: corsHeaders(origin),
    });
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Reflect the exact allowed origin back — required for credentialed requests. */
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json',
  };
}