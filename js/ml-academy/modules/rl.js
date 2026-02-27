import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function rl(stage) {
    const N = 5, TRUE_PROBS = [.15, .35, .55, .25, .70];
    let counts, wins, round, algo = 'ucb', running = false, timer = null;
    function reset() { counts = Array(N).fill(0); wins = Array(N).fill(0); round = 0; }
    reset();
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🎰</div><div class="module-name">BANDIT CASINO</div><div class="module-desc">5 slot machines with hidden payouts. Watch the AI learn which one is best.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">STRATEGY:</span><select class="ctrl-select" id="rl-al"><option value="ucb">UCB1</option><option value="thompson">THOMPSON</option><option value="random">RANDOM</option></select>
    <button class="ctrl-btn" id="rl-play">▶ AUTO-PLAY</button><button class="ctrl-btn" id="rl-step">STEP</button><button class="ctrl-btn" id="rl-rst">RESET</button>
    <span class="ctrl-label" style="margin-left:auto">ROUND: <span id="rl-rnd">0</span></span></div>
    <div class="slot-row" id="rl-slots"></div>
    <div class="canvas-wrap"><canvas id="rl-cv" height="200"></canvas></div>
    <div class="stat-grid" id="rl-st"></div><div class="info-box" id="rl-nf"><span class="hl">// UCB1</span> — Balances exploration vs exploitation using confidence bounds.</div>`;
    const cv = $('rl-cv'), cx = cv.getContext('2d');
    function rsz() { cv.width = cv.parentElement.clientWidth; cv.height = 200; drawChart(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    $('rl-al').onchange = e => { algo = e.target.value; const tips = { ucb: 'UCB1 — Picks arm with highest upper confidence bound.', thompson: 'Thompson Sampling — Draws from Beta posteriors.', random: 'Random — No strategy, pure exploration.' }; $('rl-nf').innerHTML = '<span class="hl">// ' + algo.toUpperCase() + '</span> — ' + tips[algo]; };
    $('rl-play').onclick = () => { if (running) { clearInterval(timer); running = false; $('rl-play').textContent = '▶ AUTO-PLAY'; return; } running = true; $('rl-play').textContent = '⏸ PAUSE'; timer = setInterval(() => { if (round >= 200) { clearInterval(timer); running = false; $('rl-play').textContent = '▶ AUTO-PLAY'; return; } step(); }, 100); };
    $('rl-step').onclick = step;
    $('rl-rst').onclick = () => { reset(); running = false; clearInterval(timer); $('rl-play').textContent = '▶ AUTO-PLAY'; renderSlots(); drawChart(); };
    function pick() {
        if (algo === 'random') return Math.floor(Math.random() * N);
        if (algo === 'ucb') { const total = counts.reduce((a, b) => a + b, 0); if (total < N) return total; let best = -1, bestV = -Infinity; for (let i = 0; i < N; i++) { const avg = wins[i] / counts[i], ucb = avg + Math.sqrt(2 * Math.log(total) / counts[i]); if (ucb > bestV) { bestV = ucb; best = i; } } return best; }
        // Thompson
        let best = -1, bestV = -Infinity; for (let i = 0; i < N; i++) { const a = wins[i] + 1, b = counts[i] - wins[i] + 1; const sample = betaSample(a, b); if (sample > bestV) { bestV = sample; best = i; } } return best;
    }
    function betaSample(a, b) { let x = gammaSample(a), y = gammaSample(b); return x / (x + y); }
    function gammaSample(shape) { if (shape < 1) { const u = Math.random(); return gammaSample(shape + 1) * Math.pow(u, 1 / shape); } const d = shape - 1 / 3, c = 1 / Math.sqrt(9 * d); while (true) { let x, v; do { x = randn(); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = Math.random(); if (u < 1 - .0331 * (x * x) * (x * x)) return d * v; if (Math.log(u) < .5 * x * x + d * (1 - v + Math.log(v))) return d * v; } }
    function randn() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    let history = [];
    function step() {
        const arm = pick(); const win = Math.random() < TRUE_PROBS[arm] ? 1 : 0; counts[arm]++; wins[arm] += win; round++;
        history.push({ arm, win, round });
        $('rl-rnd').textContent = round; renderSlots(); drawChart(); addXP(1);
    }
    function renderSlots() {
        const emojis = ['🍒', '🍋', '🍊', '🍇', '💎'];
        const best = counts.indexOf(Math.max(...counts));
        $('rl-slots').innerHTML = Array.from({ length: N }, (_, i) => {
            const rate = counts[i] ? ((wins[i] / counts[i]) * 100).toFixed(0) : '?';
            return `<div class="slot-machine${i === best && round > 5 ? ' best' : ''}"><div class="slot-label">PULLS: ${counts[i]}</div><div class="slot-val">${rate}%</div><div class="slot-label" style="margin-top:.2rem;font-size:.45rem;color:var(--blood)">TRUE: ${(TRUE_PROBS[i] * 100).toFixed(0)}%</div></div>`;
        }).join('');
        $('rl-st').innerHTML = `<div class="stat-card"><div class="stat-label">ROUND</div><div class="stat-value">${round}</div></div><div class="stat-card"><div class="stat-label">TOTAL WINS</div><div class="stat-value">${wins.reduce((a, b) => a + b, 0)}</div></div><div class="stat-card"><div class="stat-label">WIN RATE</div><div class="stat-value">${round ? (wins.reduce((a, b) => a + b, 0) / round * 100).toFixed(1) + '%' : '—'}</div></div><div class="stat-card"><div class="stat-label">BEST ARM</div><div class="stat-value">${emojis[best]} (${counts[best]})</div></div>`;
    }
    function drawChart() {
        const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H);
        cx.strokeStyle = 'rgba(42,21,21,0.3)'; cx.lineWidth = 1; for (let i = 0; i <= 5; i++) { const y = i * H / 5; cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
        if (!history.length) return;
        const colors = ['#ff4444', '#ffaa00', '#ff8800', '#aa44ff', '#44ccff'];
        // Cumulative win rate per arm
        const cumWins = Array(N).fill(0), cumPulls = Array(N).fill(0);
        const series = Array.from({ length: N }, () => []);
        history.forEach(h => { cumPulls[h.arm]++; cumWins[h.arm] += h.win; for (let i = 0; i < N; i++)series[i].push(cumPulls[i] ? cumWins[i] / cumPulls[i] : 0); });
        for (let a = 0; a < N; a++) {
            cx.beginPath(); cx.strokeStyle = colors[a]; cx.lineWidth = 1.5;
            series[a].forEach((v, i) => { const x = i / (history.length - 1 || 1) * W, y = (1 - v) * H; i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y); });
            cx.stroke();
        }
    }
    renderSlots(); drawChart();
}
