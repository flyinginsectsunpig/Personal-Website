import { $ } from './utils.js';
import { CHAPTERS } from './config.js';

let MODULEMAP = {};

export function registerModules(modules) {
    MODULEMAP = modules;
}

export function buildSidebar() {
    const el = $('chapter-list');
    if (!el) return;
    el.innerHTML = CHAPTERS.map(c => `<div class="ch-card" data-ch="${c.id}"><div class="ch-num">PART ${c.num}</div><div class="ch-name">${c.icon} ${c.name}</div></div>`).join('');
    el.querySelectorAll('.ch-card').forEach(card => {
        card.onclick = () => openChapter(card.dataset.ch);
    });
}

export function openChapter(id) {
    document.querySelectorAll('.ch-card').forEach(c => c.classList.toggle('active', c.dataset.ch === id));
    const ch = CHAPTERS.find(c => c.id === id);
    if (!ch) return;
    const titleEl = $('chapter-title');
    if (titleEl) {
        titleEl.textContent = ch.icon + ' ' + ch.name.toUpperCase() + ' — ' + ch.sub.toUpperCase();
    }
    const stageEl = $('stage');
    if (stageEl && MODULEMAP[id]) {
        stageEl.innerHTML = '';
        MODULEMAP[id](stageEl);
    }
}
