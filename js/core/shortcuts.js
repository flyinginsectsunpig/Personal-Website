import { DOM } from '../config/dom.js';
import { toggleChat } from '../chat/oracle.js';
import { currentScreen, backToCards } from './screen.js';
import { closeCodeDrawer } from '../realms/hire.js';
import { clearConnecting } from '../realms/system.js';
let chatOpen = false;

// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (chatOpen) {
      toggleChat();
    } else if (DOM.codeDrawer && DOM.codeDrawer.classList.contains('open')) {
      closeCodeDrawer();
    } else if (currentScreen !== 'intro' && currentScreen !== 'card-select') {
      backToCards();
    }
  }
  if (e.key === 'c' && currentScreen === 'realm-system') {
    clearConnecting();
  }
  if (e.key === '`') toggleChat();
});

// ═══════════════════════════════════════
