    // NAMED CONSTANTS  (no more magic numbers)
    // ═══════════════════════════════════════
export const WARP_LINE_COUNT = 60;
export const WARP_SPEED = 0.025;
export const PARTICLE_COUNT = 40;
export const SIM_TICK_MS = 600;
export const AUTO_EVENT_COOLDOWN = 15_000;
export const AUTO_EVENT_CHANCE = 0.12;
export const MAX_QUEUE_DEPTH = 9_999;
export const CURSOR_HOVER_SIZE = 20;
export const CURSOR_DEFAULT_SIZE = 12;
export const CURSOR_LERP = 0.15;
export const GEMINI_MODEL = 'gemini-2.5-flash';
    /**
     * Your deployed Cloudflare Worker URL.
     * After running `wrangler deploy` in the gemini-proxy/ folder,
     * replace the placeholder below with the real URL.
     * Never put your API key here — it lives as a Worker secret.
     */
export const GEMINI_PROXY_URL = 'https://gemini-proxy.zm-portfolio2026.workers.dev';
export const GEMINI_MAX_TOKENS = 1600;
export const GEMINI_TEMP_BOSS = 0.9;
export const GEMINI_TEMP_CHAT = 0.8;
export const TOAST_DURATION_MS = 3_000;
export const TOAST_FADE_MS = 500;

    // ═══════════════════════════════════════
