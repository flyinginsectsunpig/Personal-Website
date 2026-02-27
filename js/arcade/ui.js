import { APP_STATE, PERSISTENCE, EVENT_BUS } from './state.js';

export function setMode(mode) {
    const recBtn = document.getElementById("btn-rec-mode");
    const arcBtn = document.getElementById("btn-arcade-mode");
    const recContainer = document.getElementById("recruiter-mode");
    const archetype = document.getElementById('archetype-card');

    if (mode === "recruiter") {
        recBtn.classList.add("active");
        arcBtn.classList.remove("active");
        recContainer.classList.remove("hidden");

        const v = maybeArchetype();
        if (v) {
            const t = document.getElementById('archetype-text');
            if (t) t.textContent = v + ' Based on your realm decisions and play pattern.';
            if (archetype) archetype.style.display = 'block';
        }
    } else {
        arcBtn.classList.add("active");
        recBtn.classList.remove("active");
        recContainer.classList.add("hidden");
    }
}

export function maybeArchetype() {
    if (APP_STATE.profile.archetype) return APP_STATE.profile.archetype;
    if (Date.now() - APP_STATE.profile.startTs < 600000 || APP_STATE.profile.actions.total < 20) return null;
    const a = APP_STATE.profile.actions;
    APP_STATE.profile.archetype = (a.speed + a.optimize) > (a.tests + a.stability) * 1.3
        ? 'You favor speed over stability.'
        : a.tests > a.speed ? 'You optimize for reliability and guardrails.'
            : 'Balanced Systems Builder.';
    APP_STATE.profile.computedAt = Date.now();
    PERSISTENCE.saveState();
    return APP_STATE.profile.archetype;
}

export function injectChatProviderRow() {
    const panel = document.getElementById('chat-panel');
    const msgs = document.getElementById('chat-messages');
    if (!panel || !msgs || document.getElementById('chat-provider-row')) return;
    const row = document.createElement('div');
    row.id = 'chat-provider-row';
    row.innerHTML = `
        <button class="chat-provider-btn" id="provider-oracle">ORACLE CLOUD</button>
        <button class="chat-provider-btn" id="provider-ghost">LOCAL GHOST</button>
        <span id="chat-provider-status">oracle-cloud</span>
    `;
    panel.insertBefore(row, msgs);

    document.getElementById('provider-oracle').onclick = () => {
        APP_STATE.chat.mode = 'oracle';
        PERSISTENCE.saveState();
        updateProviderUI();
    };
    document.getElementById('provider-ghost').onclick = () => {
        APP_STATE.chat.mode = 'ghost';
        tryInitGhost();
    };
}

export function updateProviderUI() {
    const o = document.getElementById('provider-oracle');
    const g = document.getElementById('provider-ghost');
    const s = document.getElementById('chat-provider-status');
    if (!o || !g || !s || !APP_STATE) return;
    o.classList.toggle('active', APP_STATE.chat.mode === 'oracle');
    g.classList.toggle('active', APP_STATE.chat.mode === 'ghost');
    s.textContent = APP_STATE.chat.mode === 'ghost'
        ? (APP_STATE.chat.localReady ? 'local-ready' : `fallback:${APP_STATE.chat.fallbackReason || 'booting'}`)
        : 'oracle-cloud';
}

export async function tryInitGhost() {
    try {
        if (!('gpu' in navigator)) throw new Error('WebGPU unavailable');
        APP_STATE.chat.localReady = true;
        APP_STATE.chat.fallbackReason = null;
    } catch (e) {
        APP_STATE.chat.localReady = false;
        APP_STATE.chat.mode = 'oracle';
        APP_STATE.chat.fallbackReason = e.message || 'local init failed';
    }
    PERSISTENCE.saveState();
    updateProviderUI();
}

export function updateTraffic() {
    const p95 = Math.round(30 + Math.random() * 200);
    const trafficGrid = document.getElementById('traffic-grid');
    if (trafficGrid) {
        let cells = '';
        for (let i = 0; i < 40; i++) {
            const load = Math.random();
            let color = 'var(--ash)';
            if (load > 0.8) color = 'var(--crimson)';
            else if (load > 0.5) color = 'var(--gold)';
            cells += `<div style="background:${color};opacity:${Math.random() * 0.5 + 0.5}"></div>`;
        }
        trafficGrid.innerHTML = cells;
    }
    return p95;
}

export function initDrawer() {
    const drawer = document.getElementById('test-runner-drawer');
    if(!drawer) return;
    document.getElementById('close-tests').onclick = () => drawer.classList.remove('open');
    document.getElementById('run-tests').onclick = () => {
        const rep = window.TEST_RUNNER.runAll();
        const log = document.getElementById('test-runner-log');
        log.innerHTML = `<div>${new Date(rep.at).toLocaleTimeString()}</div>` + rep.results.map(r => `<div style="color:${r.ok ? '#66ff99' : '#ff6b6b'}">${r.ok ? 'PASS' : 'FAIL'} :: ${r.name}</div>`).join('') + `<div>${rep.passed}/${rep.total} passing</div>`;
        const i = document.getElementById('devops-tests-inline');
        if (i) i.textContent = `DevOps Tests: ${rep.passed}/${rep.total} passing`;
    };
    document.getElementById('archetype-close').onclick = () => {
        const a = document.getElementById('archetype-card');
        if(a) a.style.display = 'none';
    };
}
