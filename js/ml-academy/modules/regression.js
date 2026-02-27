import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function regression(stage) {
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
}
