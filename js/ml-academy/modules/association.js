import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function association(stage) {
    const ITEMS = ['🥛 Milk', '🍞 Bread', '🧈 Butter', '🍺 Beer', '🧷 Diapers', '🥚 Eggs', '🧀 Cheese', '🥩 Steak', '🍌 Banana', '☕ Coffee'];
    const RULES = [{ if: ['🥛 Milk', '🧷 Diapers'], then: '🍺 Beer', conf: .85, sup: .32, lift: 2.1 }, { if: ['🍞 Bread'], then: '🧈 Butter', conf: .78, sup: .45, lift: 1.8 }, { if: ['🍞 Bread', '🧈 Butter'], then: '🥚 Eggs', conf: .65, sup: .22, lift: 1.5 }, { if: ['🥩 Steak'], then: '🍺 Beer', conf: .72, sup: .18, lift: 1.9 }, { if: ['☕ Coffee'], then: '🥛 Milk', conf: .68, sup: .35, lift: 1.4 }, { if: ['🥛 Milk'], then: '🧀 Cheese', conf: .55, sup: .28, lift: 1.3 }, { if: ['🍌 Banana'], then: '🥛 Milk', conf: .62, sup: .25, lift: 1.6 }, { if: ['🍺 Beer', '🥩 Steak'], then: '🧀 Cheese', conf: .58, sup: .12, lift: 1.7 }];
    let cart = [];
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🛒</div><div class="module-name">GROCERY MIND READER</div><div class="module-desc">Click items to add to cart. Apriori predicts what you'll buy next.</div></div>
    <div class="info-box"><span class="hl">// SHELF</span> — Click to add</div><div class="shelf" id="ash"></div>
    <div class="info-box"><span class="hl">// CART</span> <span id="acc">(0)</span></div><div id="aci" style="min-height:20px;font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--bone);margin-bottom:.5rem"></div>
    <div class="info-box"><span class="hl">// SUGGESTIONS</span></div><div id="asg"></div><div class="stat-grid" id="ast" style="margin-top:.6rem"></div>`;
    function rS() { $('ash').innerHTML = ITEMS.map(it => `<div class="shelf-item${cart.includes(it) ? ' in-cart' : ''}" data-i="${it}">${it}</div>`).join(''); $('ash').querySelectorAll('.shelf-item').forEach(el => el.onclick = () => { const n = el.dataset.i; if (cart.includes(n)) cart = cart.filter(x => x !== n); else cart.push(n); rS(); rG(); addXP(1); }); }
    function rG() {
        $('acc').textContent = '(' + cart.length + ')'; $('aci').textContent = cart.length ? cart.join(' · ') : '// empty'; const m = RULES.filter(r => r.if.every(i => cart.includes(i)) && !cart.includes(r.then)).sort((a, b) => b.conf - a.conf);
        $('asg').innerHTML = m.length ? m.map(r => `<div class="suggestion"><span style="font-family:'Share Tech Mono',monospace;font-size:.6rem;color:var(--bone)">${r.then} <span style="font-size:.5rem;color:var(--ash)">(${r.if.join('+')})</span></span><span style="font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--gold);font-weight:bold">CONF:${(r.conf * 100) | 0}% SUP:${(r.sup * 100) | 0}% LIFT:${r.lift.toFixed(1)}</span></div>`).join('') : '<div style="font-family:\'Share Tech Mono\',monospace;font-size:.55rem;color:var(--ash);padding:.3rem">// add items</div>';
        $('ast').innerHTML = `<div class="stat-card"><div class="stat-label">CART</div><div class="stat-value">${cart.length}</div></div><div class="stat-card"><div class="stat-label">MATCHED</div><div class="stat-value">${m.length}</div></div><div class="stat-card"><div class="stat-label">TOP CONF</div><div class="stat-value">${m.length ? (m[0].conf * 100 | 0) + '%' : '—'}</div></div><div class="stat-card"><div class="stat-label">ALGO</div><div class="stat-value">APRIORI</div></div>`;
    }
    rS(); rG();
}
