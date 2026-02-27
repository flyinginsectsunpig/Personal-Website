import { APP_STATE, PERSISTENCE, EVENT_BUS } from './state.js';
import { REALM_MANIFEST, REALM_LOADER, TEST_RUNNER, initChaosSync } from './core.js';
import { setMode, injectChatProviderRow, updateProviderUI, tryInitGhost, initDrawer } from './ui.js';

// Re-expose globals for any inline script or dynamically loaded code that expects them.
window.APP_STATE = APP_STATE;
window.PERSISTENCE = PERSISTENCE;
window.EVENT_BUS = EVENT_BUS;
window.REALM_MANIFEST = REALM_MANIFEST;
window.REALM_LOADER = REALM_LOADER;
window.TEST_RUNNER = TEST_RUNNER;

export function initArcade() {
    // Basic setup from the massive index inline script
    initChaosSync();
    initDrawer();

    // Wire up chat toggles
    injectChatProviderRow();
    const o = document.getElementById('provider-oracle');
    const g = document.getElementById('provider-ghost');
    if (o) o.onclick = () => { APP_STATE.chat.mode = 'oracle'; PERSISTENCE.saveState(); updateProviderUI(); };
    if (g) g.onclick = async () => { APP_STATE.chat.mode = 'ghost'; PERSISTENCE.saveState(); updateProviderUI(); await tryInitGhost(); };
    updateProviderUI();

    // Hook globals for realm launches that index.html expects
    window.enterRealm = function (realm) {
        if (realm === 'ml') {
            window.location.href = 'ml-academy.html';
            return;
        }
        document.body.classList.add('warp-distort');
        setTimeout(() => document.body.classList.remove('warp-distort'), 500);
        if (typeof window.launchRealm === 'function') {
            window.launchRealm(realm);
        }
    };

    // Bind the global setMode
    window.setMode = setMode;
}

window.addEventListener('DOMContentLoaded', initArcade);
