import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function preprocess(stage) {
    const RAW = [{ age: 25, salary: 50000, city: 'NYC', purchased: 'Yes' }, { age: null, salary: 62000, city: 'LA', purchased: 'No' }, { age: 30, salary: null, city: 'NYC', purchased: 'Yes' }, { age: 35, salary: 58000, city: null, purchased: 'No' }, { age: null, salary: 45000, city: 'Chicago', purchased: 'Yes' }, { age: 28, salary: null, city: 'LA', purchased: 'No' }, { age: 40, salary: 72000, city: 'NYC', purchased: 'Yes' }, { age: null, salary: 53000, city: 'Chicago', purchased: 'No' }];
    let mm = 'mean', em = 'onehot', sm = 'standard';
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🧺</div><div class="module-name">DATA LAUNDROMAT</div><div class="module-desc">Toggle switches to clean dirty data. Watch the table transform in real-time.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">MISSING:</span><div class="toggle-group" id="tg-m"><button class="toggle-opt active" data-v="mean">MEAN</button><button class="toggle-opt" data-v="median">MEDIAN</button><button class="toggle-opt" data-v="drop">DROP</button></div>
    <span class="ctrl-label" style="margin-left:auto">ENCODE:</span><div class="toggle-group" id="tg-e"><button class="toggle-opt active" data-v="onehot">ONE-HOT</button><button class="toggle-opt" data-v="label">LABEL</button></div>
    <span class="ctrl-label" style="margin-left:auto">SCALE:</span><div class="toggle-group" id="tg-s"><button class="toggle-opt active" data-v="standard">STANDARD</button><button class="toggle-opt" data-v="minmax">MIN-MAX</button><button class="toggle-opt" data-v="none">NONE</button></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem"><div><div class="info-box"><span class="hl">// BEFORE</span></div><div id="tb-b"></div></div><div><div class="info-box"><span class="hl">// AFTER</span></div><div id="tb-a"></div></div></div><div class="stat-grid" id="pp-s"></div>`;
    function wire(gid, cb) { document.getElementById(gid).querySelectorAll('.toggle-opt').forEach(b => b.onclick = () => { document.getElementById(gid).querySelectorAll('.toggle-opt').forEach(x => x.classList.remove('active')); b.classList.add('active'); cb(b.dataset.v); render(); }); }
    wire('tg-m', v => { mm = v }); wire('tg-e', v => { em = v }); wire('tg-s', v => { sm = v });
    function render() {
        const cols = ['age', 'salary', 'city', 'purchased'];
        const tbB = document.getElementById('tb-b');
        if (tbB) tbB.innerHTML = '<table class="data-table"><tr>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr>' + RAW.map(r => '<tr>' + cols.map(c => '<td' + (r[c] === null ? ' class="miss"' : '') + '>' + (r[c] === null ? 'NaN' : r[c]) + '</td>').join('') + '</tr>').join('') + '</table>';
        let data = RAW.map(r => ({ ...r })), dropped = 0;
        if (mm === 'drop') { const b = data.length; data = data.filter(r => cols.every(c => r[c] !== null)); dropped = b - data.length; }
        else { ['age', 'salary'].forEach(col => { const v = data.map(r => r[col]).filter(x => x !== null); let f; if (mm === 'mean') f = Math.round(v.reduce((a, b) => a + b, 0) / v.length); else { const s = [...v].sort((a, b) => a - b); f = s.length % 2 ? s[s.length / 2 | 0] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2); } data.forEach(r => { if (r[col] === null) r[col] = f; }); }); data.forEach(r => { if (r.city === null) r.city = 'NYC'; }); }
        const cities = [...new Set(data.map(r => r.city))].sort(); let ed;
        if (em === 'onehot') ed = data.map(r => { const o = { age: r.age, salary: r.salary }; cities.forEach(c => o['city_' + c] = r.city === c ? 1 : 0); o.purchased = r.purchased === 'Yes' ? 1 : 0; return o; });
        else { const m = {}; cities.forEach((c, i) => m[c] = i); ed = data.map(r => ({ age: r.age, salary: r.salary, city: m[r.city] || 0, purchased: r.purchased === 'Yes' ? 1 : 0 })); }
        if (sm !== 'none') { ['age', 'salary'].forEach(col => { const v = ed.map(r => r[col]); if (sm === 'standard') { const m = v.reduce((a, b) => a + b, 0) / v.length, s = Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / v.length) || 1; ed.forEach(r => r[col] = ((r[col] - m) / s).toFixed(2)); } else { const mn = Math.min(...v), mx = Math.max(...v), rg = mx - mn || 1; ed.forEach(r => r[col] = ((r[col] - mn) / rg).toFixed(2)); } }); }
        const ac = Object.keys(ed[0] || {});
        const tbA = document.getElementById('tb-a');
        if (tbA) tbA.innerHTML = '<table class="data-table"><tr>' + ac.map(c => '<th>' + c + '</th>').join('') + '</tr>' + ed.map(r => '<tr>' + ac.map(c => '<td class="fix">' + r[c] + '</td>').join('') + '</tr>').join('') + '</table>';
        const ppS = document.getElementById('pp-s');
        if (ppS) ppS.innerHTML = `<div class="stat-card"><div class="stat-label">ROWS</div><div class="stat-value">${RAW.length}→${ed.length}</div></div><div class="stat-card"><div class="stat-label">FEATURES</div><div class="stat-value">${cols.length}→${ac.length}</div></div><div class="stat-card"><div class="stat-label">MISSING</div><div class="stat-value">${mm.toUpperCase()}</div></div><div class="stat-card"><div class="stat-label">ENCODE</div><div class="stat-value">${em === 'onehot' ? 'ONE-HOT' : 'LABEL'}</div></div><div class="stat-card"><div class="stat-label">SCALE</div><div class="stat-value">${sm.toUpperCase()}</div></div><div class="stat-card"><div class="stat-label">DROPPED</div><div class="stat-value">${dropped}</div></div>`;
    }
    render();
}
