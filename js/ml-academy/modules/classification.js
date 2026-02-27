import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function classification(stage) {
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
}
