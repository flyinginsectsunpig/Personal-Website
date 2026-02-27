import { DOM } from '../config/dom.js';
import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from '../config/constants.js';

    // CURSOR
    // ═══════════════════════════════════════
export let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

export function animateCursor() {
      rx += (mx - rx) * CURSOR_LERP;
      ry += (my - ry) * CURSOR_LERP;
      DOM.cursor.style.left = mx + 'px';
      DOM.cursor.style.top = my + 'px';
      DOM.cursorRing.style.left = rx + 'px';
      DOM.cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('button, .realm-card, .algo-btn, .solution-btn, .pipeline-stage')
      .forEach(el => {
        el.addEventListener('mouseenter', () => {
          DOM.cursor.style.width = DOM.cursor.style.height = CURSOR_HOVER_SIZE + 'px';
        });
        el.addEventListener('mouseleave', () => {
          DOM.cursor.style.width = DOM.cursor.style.height = CURSOR_DEFAULT_SIZE + 'px';
        });
      });

    // ═══════════════════════════════════════
