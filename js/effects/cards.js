import { $ } from '../config/dom.js';
    // HOLO-TILT + GLARE + AMBIENT + SOUND + CARD FX
    // ═══════════════════════════════════════

export const REALM_AMBIENCE = {
      system: 'radial-gradient(ellipse at 50% 30%, #1a0505 0%, #050505 60%)',
      database: 'radial-gradient(ellipse at 50% 30%, #050518 0%, #050505 60%)',
      ml: 'radial-gradient(ellipse at 50% 30%, #05050f 0%, #050505 60%)',
      devops: 'radial-gradient(ellipse at 50% 30%, #0c0518 0%, #050505 60%)',
      projects: 'radial-gradient(ellipse at 50% 30%, #0f0802 0%, #050505 60%)',
      hire: 'radial-gradient(ellipse at 50% 30%, #020c05 0%, #050505 60%)',
      backend: 'radial-gradient(ellipse at 50% 30%, #030f03 0%, #050505 60%)',
      default: 'radial-gradient(ellipse at 50% 30%, #150505 0%, #050505 60%)',
    };

export let _audioCtx = null;
export function _getAudioCtx() {
      if (!_audioCtx) {
        try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
      }
      return _audioCtx;
    }

export function playHoverBlip() {
      const ctx = _getAudioCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.14);
      } catch (e) { }
    }

export function initHoloCards() {
      const cardSelect = $('card-select');
      document.querySelectorAll('.realm-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.classList.remove('float-idle');
          playHoverBlip();
          const realm = card.getAttribute('data-realm');
          if (cardSelect && REALM_AMBIENCE[realm]) {
            cardSelect.style.background = REALM_AMBIENCE[realm];
          }
        });

        card.addEventListener('mouseleave', () => {
          card.classList.add('float-idle');
          card.style.transform = '';
          card.style.transition = '';
          const glare = card.querySelector('.card-glare');
          if (glare) glare.style.background = 'none';
          if (cardSelect) cardSelect.style.background = REALM_AMBIENCE.default;
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const rotX = -(dy / (rect.height / 2)) * 16;
          const rotY = (dx / (rect.width / 2)) * 16;
          card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.04)`;
          card.style.transition = 'transform 0.05s linear';
          const glare = card.querySelector('.card-glare');
          if (glare) {
            const lgx = (50 - dx / rect.width * 100).toFixed(1);
            const lgy = (50 - dy / rect.height * 100).toFixed(1);
            glare.style.background = `radial-gradient(circle at ${lgx}% ${lgy}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
          }
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
      });
    }
    // ═══════════════════════════════════════
