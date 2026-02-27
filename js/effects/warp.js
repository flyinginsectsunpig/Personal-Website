import { DOM } from '../config/dom.js';
import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from '../config/constants.js';
import { showScreen, setCurrentRealm } from '../core/screen.js';
import { initSystemRealm } from '../realms/system.js';
import { initDBRealm } from '../realms/database.js';
import { initDevOps } from '../realms/devops.js';
import { initHireRealm } from '../realms/hire.js';

// WARP TUNNEL
// ═══════════════════════════════════════
export let warpAnim = null;

export function enterRealm(realm) {
  const cardEl = [...document.querySelectorAll('.realm-card')]
    .find(c => c.getAttribute('onclick')?.includes(realm));
  if (!cardEl) { launchRealm(realm); return; }

  const rect = cardEl.getBoundingClientRect();
  const overlay = DOM.warpOverlay;
  const clone = DOM.warpClone;
  const warpCanvas = DOM.warpCanvas;
  const ctx = warpCanvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  warpCanvas.width = window.innerWidth * dpr;
  warpCanvas.style.width = window.innerWidth + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  warpCanvas.height = window.innerHeight * dpr;
  warpCanvas.style.height = window.innerHeight + 'px';

  clone.textContent = cardEl.getAttribute('data-sigil') || '⚡';
  clone.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;transform-origin:center center;transition:none;`;

  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'all';

  let progress = 0;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speed: 1 + Math.random() * 3,
  }));

  // Calculate the scale needed to make the card cover the entire screen
  const targetScale = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.5;

  function warpFrame() {
    progress += WARP_SPEED;
    // Apply an ease-in exponential curve to progress for the dramatic zoom rush
    const easedProgress = progress < 1 ? Math.pow(progress, 3) : 1;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = `rgba(5,0,0,${Math.min(progress * 0.8, 0.85)})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Radial speed lines
    for (let i = 0; i < WARP_LINE_COUNT; i++) {
      const angle = (i / WARP_LINE_COUNT) * Math.PI * 2;
      const speed = progress * progress * 800;
      const sx = cx + Math.cos(angle) * speed * 0.1;
      const sy = cy + Math.sin(angle) * speed * 0.1;
      const ex = cx + Math.cos(angle) * (speed + 50 + Math.random() * 30);
      const ey = cy + Math.sin(angle) * (speed + 50 + Math.random() * 30);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(220,20,60,${Math.max(0, 0.8 - progress * 0.3)})`;
      ctx.lineWidth = 0.5 + progress;
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // Stars rushing outward
    stars.forEach(star => {
      const dx = star.x - cx;
      const dy = star.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,20,60,${0.6 * progress})`;
      ctx.arc(
        star.x + (dx / dist) * star.speed * progress * 15,
        star.y + (dy / dist) * star.speed * progress * 15,
        1 + progress, 0, Math.PI * 2
      );
      ctx.fill();
    });

    // 3D Teleport camera rush into the card
    const currentScale = 1 + (targetScale - 1) * easedProgress;

    // Move the card center towards the true center of the screen as it scales
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    // Calculate translation needed to center the zooming card
    const tx = (screenCenterX - cx) * easedProgress;
    const ty = (screenCenterY - cy) * easedProgress;

    // Apply scale AND translate to the clone element so it actually zooms
    clone.style.transform = `translate(${tx}px, ${ty}px) scale(${currentScale})`;

    // Fade card content out at the very end to seamlessly transition to the realm background
    clone.style.opacity = Math.max(0, 1 - easedProgress * 1.5);
    clone.style.boxShadow = `0 0 ${easedProgress * 200}px rgba(220,20,60, ${Math.min(1, easedProgress * 2)})`;

    if (progress < 1) {
      warpAnim = requestAnimationFrame(warpFrame);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      clone.style.cssText = 'left:;top:;width:180px;height:300px;opacity:1;transform:none;';
      launchRealm(realm);
    }
  }

  warpAnim = requestAnimationFrame(warpFrame);
}

/** Realm initialiser registry — Open/Closed: add new realms without touching launchRealm. */
export const REALM_INITS = {
  system: initSystemRealm,
  database: initDBRealm,
  devops: initDevOps,
  hire: initHireRealm,
  // 'projects' has no init needed
};

export function launchRealm(realm) {
  setCurrentRealm(realm);
  showScreen('realm-' + realm);
  REALM_INITS[realm]?.();
}


