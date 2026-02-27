import { $ } from './utils.js';

let xp = 0;

export function addXP(n) {
    xp += n;
    const valEl = $('xp-val');
    const fillEl = $('xp-fill');
    if (valEl) valEl.textContent = xp;
    if (fillEl) fillEl.style.width = Math.min(xp, 100) + '%';
}

export function getXP() {
    return xp;
}
