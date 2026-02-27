import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function clustering(stage) {
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
}
