/* ════════════════════════════════════════
   ML ACADEMY — CORE + MODULES 1-5
   ════════════════════════════════════════ */
const $ = id => document.getElementById(id);
let xp = 0;
const CHAPTERS = [
    { id: 'preprocess', num: '01', name: 'Data Laundromat', icon: '🧺', sub: 'Preprocessing' },
    { id: 'regression', num: '02', name: 'Line of Best Fit', icon: '📈', sub: 'Regression' },
    { id: 'classification', num: '03', name: 'The Great Divider', icon: '🎯', sub: 'Classification' },
    { id: 'clustering', num: '04', name: 'Finding Families', icon: '🔬', sub: 'Clustering' },
    { id: 'association', num: '05', name: 'Grocery Mind Reader', icon: '🛒', sub: 'Association Rules' },
    { id: 'rl', num: '06', name: 'Bandit Casino', icon: '🎰', sub: 'Reinforcement Learning' },
    { id: 'nlp', num: '07', name: 'Sentiment Thermometer', icon: '💬', sub: 'NLP' },
    { id: 'deeplearn', num: '08', name: 'Digital Brain', icon: '🧠', sub: 'Deep Learning' },
    { id: 'dimreduce', num: '09', name: 'Shadow Caster', icon: '🔦', sub: 'Dimensionality Reduction' },
    { id: 'boosting', num: '10', name: 'Performance Lab', icon: '🏆', sub: 'Model Selection & Boosting' },
];
function addXP(n) { xp += n; $('xp-val').textContent = xp; $('xp-fill').style.width = Math.min(xp, 100) + '%'; }
const MODULES = {};
function buildSidebar() {
    const el = $('chapter-list');
    el.innerHTML = CHAPTERS.map(c => `<div class="ch-card" data-ch="${c.id}"><div class="ch-num">PART ${c.num}</div><div class="ch-name">${c.icon} ${c.name}</div></div>`).join('');
    el.querySelectorAll('.ch-card').forEach(card => { card.onclick = () => openChapter(card.dataset.ch); });
}
function openChapter(id) {
    document.querySelectorAll('.ch-card').forEach(c => c.classList.toggle('active', c.dataset.ch === id));
    const ch = CHAPTERS.find(c => c.id === id);
    $('chapter-title').textContent = ch.icon + ' ' + ch.name.toUpperCase() + ' — ' + ch.sub.toUpperCase();
    if (MODULES[id]) { $('stage').innerHTML = ''; MODULES[id]($('stage')); }
}
buildSidebar();

/* ─── 1: DATA PREPROCESSING ─── */
MODULES.preprocess = function (stage) {
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
        $('tb-b').innerHTML = '<table class="data-table"><tr>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr>' + RAW.map(r => '<tr>' + cols.map(c => '<td' + (r[c] === null ? ' class="miss"' : '') + '>' + (r[c] === null ? 'NaN' : r[c]) + '</td>').join('') + '</tr>').join('') + '</table>';
        let data = RAW.map(r => ({ ...r })), dropped = 0;
        if (mm === 'drop') { const b = data.length; data = data.filter(r => cols.every(c => r[c] !== null)); dropped = b - data.length; }
        else { ['age', 'salary'].forEach(col => { const v = data.map(r => r[col]).filter(x => x !== null); let f; if (mm === 'mean') f = Math.round(v.reduce((a, b) => a + b, 0) / v.length); else { const s = [...v].sort((a, b) => a - b); f = s.length % 2 ? s[s.length / 2 | 0] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2); } data.forEach(r => { if (r[col] === null) r[col] = f; }); }); data.forEach(r => { if (r.city === null) r.city = 'NYC'; }); }
        const cities = [...new Set(data.map(r => r.city))].sort(); let ed;
        if (em === 'onehot') ed = data.map(r => { const o = { age: r.age, salary: r.salary }; cities.forEach(c => o['city_' + c] = r.city === c ? 1 : 0); o.purchased = r.purchased === 'Yes' ? 1 : 0; return o; });
        else { const m = {}; cities.forEach((c, i) => m[c] = i); ed = data.map(r => ({ age: r.age, salary: r.salary, city: m[r.city] || 0, purchased: r.purchased === 'Yes' ? 1 : 0 })); }
        if (sm !== 'none') { ['age', 'salary'].forEach(col => { const v = ed.map(r => r[col]); if (sm === 'standard') { const m = v.reduce((a, b) => a + b, 0) / v.length, s = Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / v.length) || 1; ed.forEach(r => r[col] = ((r[col] - m) / s).toFixed(2)); } else { const mn = Math.min(...v), mx = Math.max(...v), rg = mx - mn || 1; ed.forEach(r => r[col] = ((r[col] - mn) / rg).toFixed(2)); } }); }
        const ac = Object.keys(ed[0] || {});
        $('tb-a').innerHTML = '<table class="data-table"><tr>' + ac.map(c => '<th>' + c + '</th>').join('') + '</tr>' + ed.map(r => '<tr>' + ac.map(c => '<td class="fix">' + r[c] + '</td>').join('') + '</tr>').join('') + '</table>';
        $('pp-s').innerHTML = `<div class="stat-card"><div class="stat-label">ROWS</div><div class="stat-value">${RAW.length}→${ed.length}</div></div><div class="stat-card"><div class="stat-label">FEATURES</div><div class="stat-value">${cols.length}→${ac.length}</div></div><div class="stat-card"><div class="stat-label">MISSING</div><div class="stat-value">${mm.toUpperCase()}</div></div><div class="stat-card"><div class="stat-label">ENCODE</div><div class="stat-value">${em === 'onehot' ? 'ONE-HOT' : 'LABEL'}</div></div><div class="stat-card"><div class="stat-label">SCALE</div><div class="stat-value">${sm.toUpperCase()}</div></div><div class="stat-card"><div class="stat-label">DROPPED</div><div class="stat-value">${dropped}</div></div>`;
    }
    render();
};

/* ─── 2: REGRESSION ─── */
MODULES.regression = function (stage) {
    let pts = [], mode = 'linear', deg = 2;
    stage.innerHTML = `<div class="module-header"><div class="module-icon">📈</div><div class="module-name">LINE OF BEST FIT</div><div class="module-desc">Click to add points. Watch regression models adapt in real-time.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">MODEL:</span><button class="ctrl-btn active" data-m="linear">LINEAR</button><button class="ctrl-btn" data-m="poly">POLY</button><button class="ctrl-btn" data-m="svr">SVR</button><button class="ctrl-btn" data-m="rf">RAND FOREST</button>
    <span class="ctrl-label" style="margin-left:auto" id="dl">DEG:<span id="dv">2</span></span><input type="range" class="ctrl-slider" id="ds" min="1" max="10" value="2" style="display:none"><button class="ctrl-btn" id="rc">CLEAR</button></div>
    <div class="canvas-wrap"><canvas id="rcv" height="400"></canvas></div><div class="stat-grid" id="rs"></div><div class="info-box" id="ri"><span class="hl">// Click to add points (≥2)</span></div>`;
    const cv = $('rcv'), cx = cv.getContext('2d');
    function rsz() { cv.width = cv.parentElement.clientWidth; cv.height = 400; draw(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    cv.onclick = e => { const r = cv.getBoundingClientRect(); pts.push({ x: (e.clientX - r.left) / cv.width, y: 1 - (e.clientY - r.top) / cv.height }); draw(); addXP(1); };
    $('rc').onclick = () => { pts = []; draw(); };
    stage.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { stage.querySelectorAll('[data-m]').forEach(x => x.classList.remove('active')); b.classList.add('active'); mode = b.dataset.m; $('ds').style.display = mode === 'poly' ? '' : 'none'; $('dl').style.display = mode === 'poly' ? '' : 'none'; draw(); });
    $('ds').oninput = e => { deg = +e.target.value; $('dv').textContent = deg; draw(); };
    function pFit(X, y, d) { const n = X.length, m = d + 1, A = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => { let s = 0; for (let k = 0; k < n; k++)s += Math.pow(X[k], i) * Math.pow(X[k], j); return s; })), B = Array.from({ length: m }, (_, i) => { let s = 0; for (let k = 0; k < n; k++)s += Math.pow(X[k], i) * y[k]; return s; }); for (let i = 0; i < m; i++) { let mx = i; for (let k = i + 1; k < m; k++)if (Math.abs(A[k][i]) > Math.abs(A[mx][i])) mx = k;[A[i], A[mx]] = [A[mx], A[i]];[B[i], B[mx]] = [B[mx], B[i]]; if (Math.abs(A[i][i]) < 1e-12) continue; for (let k = i + 1; k < m; k++) { const f = A[k][i] / A[i][i]; for (let j = i; j < m; j++)A[k][j] -= f * A[i][j]; B[k] -= f * B[i]; } } const c = new Array(m).fill(0); for (let i = m - 1; i >= 0; i--) { let s = B[i]; for (let j = i + 1; j < m; j++)s -= A[i][j] * c[j]; c[i] = s / (A[i][i] || 1); } return c; }
    function draw() {
        const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H);
        cx.strokeStyle = 'rgba(42,21,21,0.4)'; cx.lineWidth = 1; for (let i = 0; i <= 10; i++) { cx.beginPath(); cx.moveTo(i * W / 10, 0); cx.lineTo(i * W / 10, H); cx.stroke(); cx.beginPath(); cx.moveTo(0, i * H / 10); cx.lineTo(W, i * H / 10); cx.stroke(); }
        pts.forEach(p => { cx.beginPath(); cx.arc(p.x * W, (1 - p.y) * H, 5, 0, Math.PI * 2); cx.fillStyle = '#DC143C'; cx.fill(); cx.strokeStyle = 'rgba(220,20,60,0.4)'; cx.lineWidth = 2; cx.stroke(); });
        if (pts.length < 2) { $('rs').innerHTML = ''; return; }
        const xs = pts.map(p => p.x), ys = pts.map(p => p.y); let fn;
        if (mode === 'linear' || mode === 'svr') { const n = xs.length, sx = xs.reduce((a, b) => a + b), sy = ys.reduce((a, b) => a + b), sxy = xs.reduce((a, x, i) => a + x * ys[i], 0), sxx = xs.reduce((a, x) => a + x * x, 0), sl = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1), it = (sy - sl * sx) / n; fn = x => sl * x + it; }
        else if (mode === 'poly') { const d = Math.min(deg, pts.length - 1), c = pFit(xs, ys, d); fn = x => { let v = 0; for (let i = 0; i <= d; i++)v += c[i] * Math.pow(x, i); return v; }; }
        else { const so = [...pts].sort((a, b) => a.x - b.x), bk = Math.min(5, Math.max(2, so.length / 2 | 0)), st = so.length / bk, rg = []; for (let i = 0; i < bk; i++) { const sl = so.slice(i * st | 0, (i + 1) * st | 0); if (sl.length) rg.push({ f: sl[0].x, t: sl[sl.length - 1].x, a: sl.reduce((a, p) => a + p.y, 0) / sl.length }); } fn = x => { for (const r of rg) if (x >= r.f && x <= r.t) return r.a; return rg[rg.length - 1].a; }; }
        cx.beginPath(); cx.strokeStyle = mode === 'svr' ? '#00cc66' : '#DC143C'; cx.lineWidth = 2;
        for (let i = 0; i <= 200; i++) { const x = i / 200, y = fn(x), px = x * W, py = (1 - y) * H; if (i === 0) cx.moveTo(px, py); else if (mode === 'rf') { cx.lineTo(px, (1 - fn((i - 1) / 200)) * H); cx.lineTo(px, py); } else cx.lineTo(px, py); } cx.stroke();
        if (mode === 'svr') { const ep = .08; cx.strokeStyle = 'rgba(0,204,102,0.3)'; cx.lineWidth = 1; cx.setLineDash([4, 4]);[ep, -ep].forEach(o => { cx.beginPath(); for (let i = 0; i <= 200; i++) { const x = i / 200, y = fn(x) + o; i === 0 ? cx.moveTo(x * W, (1 - y) * H) : cx.lineTo(x * W, (1 - y) * H); } cx.stroke(); }); cx.setLineDash([]); cx.fillStyle = 'rgba(0,204,102,0.05)'; cx.beginPath(); for (let i = 0; i <= 200; i++) { const x = i / 200; cx.lineTo(x * W, (1 - (fn(x) + ep)) * H); } for (let i = 200; i >= 0; i--) { const x = i / 200; cx.lineTo(x * W, (1 - (fn(x) - ep)) * H); } cx.fill(); }
        const yM = ys.reduce((a, b) => a + b) / ys.length, ssT = ys.reduce((a, y) => a + (y - yM) ** 2, 0), ssR = xs.reduce((a, x, i) => a + (ys[i] - fn(x)) ** 2, 0), mse = ssR / xs.length, r2 = 1 - ssR / (ssT || 1);
        $('rs').innerHTML = `<div class="stat-card"><div class="stat-label">R²</div><div class="stat-value">${r2.toFixed(4)}</div></div><div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${mse.toFixed(4)}</div></div><div class="stat-card"><div class="stat-label">PTS</div><div class="stat-value">${pts.length}</div></div><div class="stat-card"><div class="stat-label">MODEL</div><div class="stat-value">${mode.toUpperCase()}${mode === 'poly' ? ' d=' + deg : ''}</div></div>`;
        const tips = { linear: 'y=mx+b. Best for linear data.', poly: `Degree ${deg}. ${deg > 5 ? '⚠ OVERFITTING RISK!' : 'Higher degree = more flexible.'}`, svr: 'Epsilon tube — points inside don\'t affect loss.', rf: 'Staircase — each step averages a bucket.' };
        $('ri').innerHTML = '<span class="hl">// ' + mode.toUpperCase() + '</span> — ' + tips[mode];
    }
    draw();
};

/* ─── 3: CLASSIFICATION ─── */
MODULES.classification = function (stage) {
    let pts = [], cc = 0, tool = 'add', kV = 3, cm = 'knn', my = null;
    const C = ['#4488ff', '#ff4444'];
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🎯</div><div class="module-name">THE GREAT DIVIDER</div><div class="module-desc">Add class points. Drop a mystery point to see K-NN voting or SVM margins.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">ALGO:</span><select class="ctrl-select" id="ca"><option value="knn">K-NN</option><option value="svm">SVM</option></select>
    <span class="ctrl-label">CLASS:</span><button class="ctrl-btn active" id="c0">🔵 A</button><button class="ctrl-btn" id="c1">🔴 B</button><button class="ctrl-btn" id="cm">❓ MYSTERY</button>
    <span class="ctrl-label" style="margin-left:auto">K=<span id="kv">3</span></span><input type="range" class="ctrl-slider" id="ks" min="1" max="15" step="2" value="3"><button class="ctrl-btn" id="ccl">CLEAR</button></div>
    <div class="canvas-wrap"><canvas id="ccv" height="400"></canvas></div><div class="stat-grid" id="cs"></div><div class="info-box" id="ci"><span class="hl">// K-NN</span> — Add blue/red points, then place a mystery point.</div>`;
    const cv = $('ccv'), cx = cv.getContext('2d');
    function rsz() { cv.width = cv.parentElement.clientWidth; cv.height = 400; draw(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    $('c0').onclick = () => { tool = 'add'; cc = 0; $('c0').classList.add('active'); $('c1').classList.remove('active'); $('cm').classList.remove('active'); };
    $('c1').onclick = () => { tool = 'add'; cc = 1; $('c1').classList.add('active'); $('c0').classList.remove('active'); $('cm').classList.remove('active'); };
    $('cm').onclick = () => { tool = 'mystery'; $('cm').classList.add('active'); $('c0').classList.remove('active'); $('c1').classList.remove('active'); };
    $('ccl').onclick = () => { pts = []; my = null; draw(); };
    $('ca').onchange = e => { cm = e.target.value; draw(); };
    $('ks').oninput = e => { kV = +e.target.value; $('kv').textContent = kV; draw(); };
    cv.onclick = e => { const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) / cv.width, py = 1 - (e.clientY - r.top) / cv.height; if (tool === 'mystery') my = { x: px, y: py }; else pts.push({ x: px, y: py, c: cc }); draw(); addXP(1); };
    function kP(px, py) { const d = pts.map(p => ({ d: Math.hypot(p.x - px, p.y - py), c: p.c })).sort((a, b) => a.d - b.d), k = Math.min(kV, d.length), v = [0, 0]; for (let i = 0; i < k; i++)v[d[i].c]++; return v[0] >= v[1] ? 0 : 1; }
    function draw() {
        const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H);
        cx.strokeStyle = 'rgba(42,21,21,0.3)'; cx.lineWidth = 1; for (let i = 0; i <= 10; i++) { cx.beginPath(); cx.moveTo(i * W / 10, 0); cx.lineTo(i * W / 10, H); cx.stroke(); cx.beginPath(); cx.moveTo(0, i * H / 10); cx.lineTo(W, i * H / 10); cx.stroke(); }
        if (pts.length >= 2 && cm === 'knn') { const res = 25; for (let gx = 0; gx < W; gx += res)for (let gy = 0; gy < H; gy += res) { cx.fillStyle = kP(gx / W, 1 - gy / H) === 0 ? 'rgba(68,136,255,0.07)' : 'rgba(255,68,68,0.07)'; cx.fillRect(gx, gy, res, res); } }
        if (pts.length >= 2 && cm === 'svm') { const a = pts.filter(p => p.c === 0), b = pts.filter(p => p.c === 1); if (a.length && b.length) { const m0 = { x: a.reduce((s, p) => s + p.x, 0) / a.length, y: a.reduce((s, p) => s + p.y, 0) / a.length }, m1 = { x: b.reduce((s, p) => s + p.x, 0) / b.length, y: b.reduce((s, p) => s + p.y, 0) / b.length }, mx = (m0.x + m1.x) / 2, my2 = (m0.y + m1.y) / 2, dx = m1.x - m0.x, dy = m1.y - m0.y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; cx.strokeStyle = 'rgba(220,20,60,0.6)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo((mx + nx * 2) * W, (1 - (my2 + ny * 2)) * H); cx.lineTo((mx - nx * 2) * W, (1 - (my2 - ny * 2)) * H); cx.stroke(); cx.strokeStyle = 'rgba(220,20,60,0.2)'; cx.lineWidth = 1; cx.setLineDash([4, 4]); const mg = .05;[-mg, mg].forEach(o => { const ox = mx + dx / l * o, oy = my2 + dy / l * o; cx.beginPath(); cx.moveTo((ox + nx * 2) * W, (1 - (oy + ny * 2)) * H); cx.lineTo((ox - nx * 2) * W, (1 - (oy - ny * 2)) * H); cx.stroke(); }); cx.setLineDash([]); } }
        pts.forEach(p => { cx.beginPath(); cx.arc(p.x * W, (1 - p.y) * H, 6, 0, Math.PI * 2); cx.fillStyle = C[p.c]; cx.fill(); cx.strokeStyle = 'rgba(255,255,255,0.3)'; cx.lineWidth = 1; cx.stroke(); });
        if (my && pts.length >= 1) {
            cx.beginPath(); cx.arc(my.x * W, (1 - my.y) * H, 8, 0, Math.PI * 2); cx.fillStyle = 'rgba(255,255,255,0.8)'; cx.fill(); cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.stroke(); cx.fillStyle = '#000'; cx.font = 'bold 10px monospace'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('?', my.x * W, (1 - my.y) * H);
            if (cm === 'knn' && pts.length >= kV) { const ds = pts.map((p, i) => ({ i, d: Math.hypot(p.x - my.x, p.y - my.y), c: p.c })).sort((a, b) => a.d - b.d).slice(0, kV); ds.forEach(n => { const p = pts[n.i]; cx.beginPath(); cx.moveTo(my.x * W, (1 - my.y) * H); cx.lineTo(p.x * W, (1 - p.y) * H); cx.strokeStyle = C[p.c] + '88'; cx.lineWidth = 1.5; cx.stroke(); cx.beginPath(); cx.arc(p.x * W, (1 - p.y) * H, 10, 0, Math.PI * 2); cx.strokeStyle = C[p.c]; cx.lineWidth = 2; cx.stroke(); }); const vt = [0, 0]; ds.forEach(n => vt[n.c]++); const pr = vt[0] >= vt[1] ? 0 : 1; $('ci').innerHTML = `<span class="hl">// K-NN VOTE</span> K=${kV}: A=${vt[0]}, B=${vt[1]} → <span style="color:${C[pr]}">CLASS ${pr === 0 ? 'A' : 'B'}</span>`; }
        }
        $('cs').innerHTML = `<div class="stat-card"><div class="stat-label">CLASS A</div><div class="stat-value" style="color:#4488ff">${pts.filter(p => p.c === 0).length}</div></div><div class="stat-card"><div class="stat-label">CLASS B</div><div class="stat-value" style="color:#ff4444">${pts.filter(p => p.c === 1).length}</div></div><div class="stat-card"><div class="stat-label">TOTAL</div><div class="stat-value">${pts.length}</div></div><div class="stat-card"><div class="stat-label">ALGO</div><div class="stat-value">${cm.toUpperCase()}</div></div>`;
    }
    draw();
};

/* ─── 4: CLUSTERING ─── */
MODULES.clustering = function (stage) {
    let pts = [], cen = [], k = 3, asgn = [], stepping = false, stmr = null, iter = 0;
    const CC = ['#4488ff', '#ff4444', '#44cc44', '#ffaa00', '#ff44ff', '#44ffff', '#ff8800', '#8844ff'];
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🔬</div><div class="module-name">FINDING FAMILIES</div><div class="module-desc">Watch K-Means centroids hunt for clusters step by step.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">K=<span id="kk">3</span></span><input type="range" class="ctrl-slider" id="kks" min="2" max="8" value="3">
    <button class="ctrl-btn" id="kg">GENERATE</button><button class="ctrl-btn" id="kstp">STEP</button><button class="ctrl-btn" id="kauto">▶ AUTO</button><button class="ctrl-btn" id="krst">RESET</button></div>
    <div class="canvas-wrap"><canvas id="kcv" height="400"></canvas></div><div class="stat-grid" id="kst"></div><div class="info-box" id="knf"><span class="hl">// K-MEANS</span> — GENERATE points, then STEP or AUTO.</div>`;
    const cv = $('kcv'), cx = cv.getContext('2d');
    function rsz() { cv.width = cv.parentElement.clientWidth; cv.height = 400; draw(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    $('kks').oninput = e => { k = +e.target.value; $('kk').textContent = k; };
    cv.onclick = e => { const r = cv.getBoundingClientRect(); pts.push({ x: (e.clientX - r.left) / cv.width, y: 1 - (e.clientY - r.top) / cv.height }); draw(); };
    function assign() { asgn = pts.map(p => { let md = Infinity, mc = 0; cen.forEach((c, i) => { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < md) { md = d; mc = i; } }); return mc; }); }
    function move() { cen.forEach((c, i) => { const ps = pts.filter((_, j) => asgn[j] === i); if (ps.length) { c.x = ps.reduce((a, p) => a + p.x, 0) / ps.length; c.y = ps.reduce((a, p) => a + p.y, 0) / ps.length; } }); }
    function conv() { const pv = cen.map(c => ({ ...c })); assign(); move(); const ok = cen.every((c, i) => Math.abs(c.x - pv[i].x) < .001 && Math.abs(c.y - pv[i].y) < .001); cen.forEach((c, i) => { c.x = pv[i].x; c.y = pv[i].y; }); return ok; }
    $('kg').onclick = () => { pts = []; iter = 0; cen = []; asgn = []; for (let c = 0; c < k; c++) { const cx2 = .15 + Math.random() * .7, cy2 = .15 + Math.random() * .7; for (let i = 0; i < 15 + Math.floor(Math.random() * 10); i++)pts.push({ x: cx2 + (Math.random() - .5) * .2, y: cy2 + (Math.random() - .5) * .2 }); } const sh = [...pts].sort(() => Math.random() - .5); cen = sh.slice(0, k).map(p => ({ x: p.x, y: p.y })); assign(); draw(); addXP(2); };
    $('kstp').onclick = () => { if (!cen.length) return; assign(); move(); iter++; draw(); addXP(1); $('knf').innerHTML = `<span class="hl">// ITER ${iter}</span> — ${conv() ? '✅ CONVERGED!' : 'Moving centroids...'}`; };
    $('kauto').onclick = () => { if (stepping) { clearInterval(stmr); stepping = false; $('kauto').textContent = '▶ AUTO'; return; } if (!cen.length) $('kg').click(); stepping = true; $('kauto').textContent = '⏸ PAUSE'; stmr = setInterval(() => { if (conv() || iter > 50) { clearInterval(stmr); stepping = false; $('kauto').textContent = '▶ AUTO'; return; } $('kstp').click(); }, 400); };
    $('krst').onclick = () => { pts = []; cen = []; asgn = []; iter = 0; stepping = false; clearInterval(stmr); $('kauto').textContent = '▶ AUTO'; draw(); };
    function draw() {
        const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H); cx.strokeStyle = 'rgba(42,21,21,0.3)'; cx.lineWidth = 1; for (let i = 0; i <= 10; i++) { cx.beginPath(); cx.moveTo(i * W / 10, 0); cx.lineTo(i * W / 10, H); cx.stroke(); cx.beginPath(); cx.moveTo(0, i * H / 10); cx.lineTo(W, i * H / 10); cx.stroke(); }
        pts.forEach((p, i) => { cx.beginPath(); cx.arc(p.x * W, (1 - p.y) * H, 4, 0, Math.PI * 2); cx.fillStyle = asgn.length ? CC[asgn[i] % CC.length] : 'rgba(220,20,60,0.5)'; cx.fill(); });
        cen.forEach((c, i) => { const col = CC[i % CC.length]; cx.beginPath(); cx.arc(c.x * W, (1 - c.y) * H, 10, 0, Math.PI * 2); cx.strokeStyle = col; cx.lineWidth = 3; cx.stroke(); cx.beginPath(); cx.arc(c.x * W, (1 - c.y) * H, 4, 0, Math.PI * 2); cx.fillStyle = col; cx.fill(); const s = 6; cx.beginPath(); cx.moveTo(c.x * W - s, (1 - c.y) * H); cx.lineTo(c.x * W + s, (1 - c.y) * H); cx.moveTo(c.x * W, (1 - c.y) * H - s); cx.lineTo(c.x * W, (1 - c.y) * H + s); cx.strokeStyle = col; cx.lineWidth = 2; cx.stroke(); });
        $('kst').innerHTML = `<div class="stat-card"><div class="stat-label">POINTS</div><div class="stat-value">${pts.length}</div></div><div class="stat-card"><div class="stat-label">K</div><div class="stat-value">${k}</div></div><div class="stat-card"><div class="stat-label">ITER</div><div class="stat-value">${iter}</div></div><div class="stat-card"><div class="stat-label">STATUS</div><div class="stat-value">${cen.length ? (conv() ? 'CONVERGED' : 'RUNNING') : 'IDLE'}</div></div>`;
    }
    draw();
};

/* ─── 5: ASSOCIATION RULES ─── */
MODULES.association = function (stage) {
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
};
