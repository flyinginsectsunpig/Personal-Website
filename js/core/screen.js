import {$,  DOM } from '../config/dom.js';
import { createParticles } from '../effects/particles.js';
import { initWebGLBackground } from '../effects/webgl-bg.js';
import { initHoloCards } from '../effects/cards.js';
import { stopSystemSim as stopSystemRealmSim } from '../realms/system.js';

    // SCREEN MANAGEMENT
    // ═══════════════════════════════════════
export let currentScreen = 'intro';
export let currentRealm = null;
export function setCurrentRealm(realm) {
      currentRealm = realm;
    }

export function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
      const target = $(id);
      if (target) target.classList.remove('hidden');
      currentScreen = id;
    }

export function enterArcade() {
      createParticles();
      const intro = $('intro');
      if (intro) intro.style.opacity = '0';
      setTimeout(() => {
        showScreen('card-select');
        if (!window.webglInitialized) {
          initWebGLBackground();
          window.webglInitialized = true;
        }
        if (!window.holoInitialized) {
          initHoloCards();
          window.holoInitialized = true;
        }
      }, 650);
    }

    /** Stop any running system simulation — single place for teardown. */
export function stopSystemSim() {
      stopSystemRealmSim();
    }

export function backToCards() {
      DOM.chatPanel?.classList.remove('open');
      DOM.codeDrawer?.classList.remove('open');
      stopSystemSim();
      showScreen('card-select');
      setCurrentRealm(null);
    }

    // ═══════════════════════════════════════
