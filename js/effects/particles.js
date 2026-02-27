import { DOM } from '../config/dom.js';
import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from '../config/constants.js';

    // PARTICLES
    // ═══════════════════════════════════════
export function createParticles() {
      if (!DOM.particles) return;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const sx = (Math.random() * 100).toFixed(1);
        const dx = ((Math.random() - 0.5) * 200).toFixed(1);
        const dur = (6 + Math.random() * 10).toFixed(2);
        const delay = (Math.random() * 8).toFixed(2);
        p.style.cssText = `--sx:${sx}vw;--dx:${dx}px;--dur:${dur}s;--delay:${delay}s;left:0;top:0;`;
        DOM.particles.appendChild(p);
      }
    }

    // ═══════════════════════════════════════
