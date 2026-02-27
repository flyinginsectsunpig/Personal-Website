import { DOM } from '../config/dom.js';
import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from '../config/constants.js';

    // TOAST  — single responsibility: show a timed notification
    // ═══════════════════════════════════════
export function toast(msg, type = 'info') {
      const t = document.createElement('div');
      t.className = `toast ${type}`;
      t.textContent = msg;
      DOM.toasts.appendChild(t);
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transition = `opacity ${TOAST_FADE_MS}ms`;
        setTimeout(() => t.remove(), TOAST_FADE_MS);
      }, TOAST_DURATION_MS);
    }

    // ═══════════════════════════════════════
