import { APP_STATE, PERSISTENCE, EVENT_BUS } from './state.js';

export const REALM_MANIFEST = {
    intro: { initialized: true, active: true, unlocked: true },
    'card-select': { initialized: true, active: false, unlocked: true },
    system: { initialized: !!APP_STATE.realmInit.system, active: false, unlocked: true },
    database: { initialized: !!APP_STATE.realmInit.database, active: false, unlocked: true },
    ml: { initialized: !!APP_STATE.realmInit.ml, active: false, unlocked: true },
    devops: { initialized: !!APP_STATE.realmInit.devops, active: false, unlocked: true },
    projects: { initialized: !!APP_STATE.realmInit.projects, active: false, unlocked: true },
    hire: { initialized: !!APP_STATE.realmInit.hire, active: false, unlocked: true },
    backend: { initialized: !!APP_STATE.realmInit.backend, active: false, unlocked: true },
    gamedev: { initialized: !!APP_STATE.realmInit.gamedev, active: false, unlocked: true },
    architect: { initialized: !!APP_STATE.realmInit.architect, active: false, unlocked: !!APP_STATE.unlocks.architect },
    'test-runner': { initialized: false, active: false, unlocked: !!APP_STATE.unlocks.testRunner }
};

export const REALM_LOADER = {
    ensureRealmInitialized(realmId) {
        APP_STATE.realmInit[realmId] = true;
        if (!REALM_MANIFEST[realmId]) REALM_MANIFEST[realmId] = { initialized: false, active: false, unlocked: true };
        REALM_MANIFEST[realmId].initialized = true;
        PERSISTENCE.saveState();
    },
    preloadLikelyNextRealms() {
        setTimeout(() => PERSISTENCE.saveState(), 800);
    }
};

export function debounce(fn, wait = 80) {
    let t = null;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

export const TEST_RUNNER = {
    latest: null,
    runSuite(name) {
        const s = {
            queue_math: () => Math.min(9999, Math.max(0, 100 + 200 * 0.1 - 400 * 0.05)) === 100,
            system_latency_math: () => Math.round((120 + 80 * 0.2 - 40 * 0.1)) === 132,
            chaos_window: () => (APP_STATE.chaos.unstableUntil + 1) > APP_STATE.chaos.unstableUntil
        };
        return { name, ok: !!s[name]?.() };
    },
    runAll() {
        const names = ['queue_math', 'system_latency_math', 'chaos_window'];
        const results = names.map(n => this.runSuite(n));
        const passed = results.filter(r => r.ok).length;
        this.latest = { at: Date.now(), results, passed, total: names.length };
        return this.latest;
    },
    getLatestReport() { return this.latest; }
};

export function initChaosSync() {
    const chaos = document.createElement('div');
    chaos.id = 'chaos-banner';
    chaos.textContent = '[SYSTEM UNSTABLE] Cross-realm anomaly in progress.';
    document.body.appendChild(chaos);

    const syncChaos = () => {
        const unstable = APP_STATE.chaos.unstableUntil > Date.now();
        chaos.classList.toggle('show', unstable);
        document.body.classList.toggle('chaos-mode', unstable);
    };
    setInterval(syncChaos, 500);

    EVENT_BUS.on('chaos:incident', p => {
        APP_STATE.chaos.unstableUntil = Date.now() + (p?.durationMs || 12000);
        APP_STATE.chaos.lastIncident = p?.type || 'incident';
        PERSISTENCE.saveState();
        syncChaos();
    });
}
