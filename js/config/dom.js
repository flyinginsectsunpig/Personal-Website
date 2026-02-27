import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from './constants.js';

    // DOM CACHE  (single source of truth — no repeated getElementById)
    // Query once, reuse everywhere. Grouped by realm.
    // ═══════════════════════════════════════
export const $ = id => document.getElementById(id);

    /** @type {Object.<string, HTMLElement|null>} */
export const DOM = {
      // Global
      cursor: $('cursor'),
      cursorRing: $('cursor-ring'),
      toasts: $('toasts'),
      particles: $('particles'),
      chatPanel: $('chat-panel'),
      chatInput: $('chat-input'),
      chatMessages: $('chat-messages'),
      codeDrawer: $('code-drawer'),
      codeTabs: $('code-tabs'),
      codeInfo: $('code-info'),
      codeArea: $('code-area'),
      warpOverlay: $('warp-overlay'),
      warpCanvas: $('warp-canvas'),
      warpClone: $('warp-card-clone'),
      hireContent: $('hire-content'),

      // System realm
      sysCanvas: $('system-canvas'),
      trafficSlider: $('traffic-slider'),
      trafficRps: $('traffic-rps'),
      trafficLabel: $('traffic-label'),
      eventLog: $('event-log'),
      mLatency: $('m-latency'), bLatency: $('b-latency'),
      mError: $('m-error'), bError: $('b-error'),
      mThroughput: $('m-throughput'), bThroughput: $('b-throughput'),
      mCache: $('m-cache'), bCache: $('b-cache'),
      mQueue: $('m-queue'),
      mCpu: $('m-cpu'),

      // DB realm
      bossName: $('boss-name'),
      bossMs: $('boss-ms'),
      bossHp: $('boss-hp'),
      bossHpText: $('boss-hp-text'),
      queryDisplay: $('query-display'),
      queryStat: $('query-stat'),
      dbLevel: $('db-level'),
      dbFeedback: $('db-feedback'),
      dbScore: $('db-score'),
      solutionGrid: $('solution-grid'),
      knowledgeTags: $('knowledge-tags'),

      // ML realm
      mlTitle: $('ml-title'),
      mlSubtitle: $('ml-subtitle'),
      mlTarget: $('ml-target'),
      algoGrid: $('algo-grid'),
      mlRunStatus: $('ml-run-status'),
      accuracyDisplay: $('accuracy-display'),
      accuracyNumber: $('accuracy-number'),
      accuracyLabel: $('accuracy-label'),
      mlTrain: $('ml-train'),
      mlTest: $('ml-test'),
      mlOverfit: $('ml-overfit'),
      mlBias: $('ml-bias'),
      mlVar: $('ml-var'),
      mlInsight: $('ml-insight'),
      mlCleared: $('ml-cleared'),

      // DevOps realm
      stagePool: $('stage-pool'),
      pipelineTrack: $('pipeline-track'),
      pipelineLog: $('pipeline-log'),
      deployStreak: $('deploy-streak'),
      dvFreq: $('dv-freq'),
      dvLead: $('dv-lead'),
      dvFail: $('dv-fail'),
      dvMttr: $('dv-mttr'),
    };

    // ───────────────────────────────────────
    // Null-safe DOM helper — set text + optional class
    // ───────────────────────────────────────
    /** @param {HTMLElement|null} el @param {string} text @param {string} [cls] */
export function setText(el, text, cls) {
      if (!el) return;
      el.textContent = text;
      if (cls !== undefined) el.className = cls;
    }

    /**
     * Update a metric display + its progress bar in one call.
     * @param {HTMLElement|null} label @param {HTMLElement|null} bar
     * @param {string} text @param {string} cls @param {number} pct 0-100
     */
export function setMetricDisplay(label, bar, text, cls, pct) {
      setText(label, text, 'metric-value ' + cls);
      if (bar) {
        bar.style.width = Math.min(100, pct) + '%';
        bar.style.background = cls === 'good' ? '#00cc66' : cls === 'warn' ? '#ff8c00' : 'var(--crimson)';
      }
    }

    /**
     * Single entry-point for all Gemini API calls.
     * Calls your Cloudflare Worker proxy — the API key never touches the browser.
     * Strips markdown fences and returns the raw text string.
     * @param {string} prompt
     * @param {number} [temperature=GEMINI_TEMP_CHAT]
     * @param {number} [maxTokens=GEMINI_MAX_TOKENS]
     * @returns {Promise<string>}
     */
export async function callGemini(prompt, temperature = GEMINI_TEMP_CHAT, maxTokens = GEMINI_MAX_TOKENS) {
      const res = await fetch(GEMINI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return raw.replace(/```json|```/g, '').trim();
    }


    // ═══════════════════════════════════════
