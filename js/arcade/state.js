const STORAGE_KEY = 'backend_arcade_state_v1';

export const DEFAULT_STATE = {
    xp: 0,
    level: 1,
    unlocks: {
        architect: false,
        testRunner: false,
    },
    realmInit: {
        system: false,
        database: false,
        ml: false,
        devops: false,
        projects: false,
        hire: false,
        backend: false,
        gamedev: false,
        architect: false,
    },
    profile: {
        startTs: Date.now(),
        archetype: null,
        computedAt: null,
        actions: {
            total: 0,
            speed: 0,
            optimize: 0,
            tests: 0,
            stability: 0,
        },
    },
    chat: {
        mode: 'oracle',
        localReady: false,
        fallbackReason: 'booting',
    },
    chaos: {
        unstableUntil: 0,
        lastIncident: null,
    },
    settings: {
        sound: true,
        crt: true,
        chaos: true,
    },
};

// Central App State
export const APP_STATE = structuredClone(DEFAULT_STATE);

// Publisher-Subscriber for inter-component messaging
export const EVENT_BUS = {
    listeners: {},
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
};

function deepMerge(target, source) {
    for (const [k, v] of Object.entries(source || {})) {
        if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
            deepMerge(target[k], v);
        } else {
            target[k] = v;
        }
    }
    return target;
}

export const PERSISTENCE = {
    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE));
        } catch (e) {
            console.warn('PERSISTENCE.saveState failed:', e);
        }
    },
    loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            deepMerge(APP_STATE, parsed);
        } catch (e) {
            console.warn('PERSISTENCE.loadState failed:', e);
        }
    },
    resetState() {
        deepMerge(APP_STATE, structuredClone(DEFAULT_STATE));
        this.saveState();
    },
};

PERSISTENCE.loadState();

// Add XP and level up
export function addXP(amount) {
    if (!amount) return;
    APP_STATE.xp += amount;

    const xpSpan = document.getElementById('sh-xp');
    if (xpSpan) {
        xpSpan.textContent = Math.floor(APP_STATE.xp);
        xpSpan.style.color = 'var(--gold)';
        setTimeout(() => xpSpan.style.color = 'var(--bone)', 300);
    }

    // Simple level up logic
    const nextLevelReq = APP_STATE.level * 100;
    if (APP_STATE.xp >= nextLevelReq) {
        APP_STATE.level++;
        APP_STATE.xp -= nextLevelReq;
        EVENT_BUS.emit('LEVEL_UP', APP_STATE.level);

        const lvlSpan = document.getElementById('sh-lvl');
        if (lvlSpan) {
            lvlSpan.textContent = APP_STATE.level;
            lvlSpan.style.textShadow = '0 0 10px var(--gold)';
            setTimeout(() => lvlSpan.style.textShadow = 'none', 1000);
        }
    }
}
