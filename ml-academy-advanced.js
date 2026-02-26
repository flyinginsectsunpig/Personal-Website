/* ════════════════════════════════════════
   ML ACADEMY — MODULES 6-10
   ════════════════════════════════════════ */

/* ─── 6: REINFORCEMENT LEARNING ─── */
MODULES.rl = function (stage) {
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
            return `<div class="slot-machine${i === best && round > 5 ? ' best' : ''}"><div class="slot-emoji">${emojis[i]}</div><div class="slot-label">PULLS: ${counts[i]}</div><div class="slot-val">${rate}%</div><div class="slot-label" style="margin-top:.2rem;font-size:.45rem;color:var(--blood)">TRUE: ${(TRUE_PROBS[i] * 100).toFixed(0)}%</div></div>`;
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
};

/* ─── 7: NLP ─── */
MODULES.nlp = function (stage) {
    const POS = ['happy', 'great', 'love', 'wonderful', 'excellent', 'amazing', 'good', 'best', 'fantastic', 'awesome', 'joy', 'beautiful', 'brilliant', 'perfect', 'delight'];
    const NEG = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'worst', 'ugly', 'angry', 'sad', 'disgusting', 'poor', 'boring', 'annoying', 'stupid', 'failure'];
    stage.innerHTML = `<div class="module-header"><div class="module-icon">💬</div><div class="module-name">SENTIMENT THERMOMETER</div><div class="module-desc">Type a sentence. Watch words fly into buckets and the sentiment gauge react.</div></div>
    <div class="ctrl-bar"><span class="ctrl-label">TYPE:</span><input type="text" id="nlp-in" placeholder="Type a sentence..." style="flex:1;background:var(--panel);color:var(--bone);border:1px solid var(--border);padding:.4rem .6rem;font-family:'Share Tech Mono',monospace;font-size:.65rem;outline:none"></div>
    <div class="info-box"><span class="hl">// BAG OF WORDS</span></div><div class="bucket-row" id="nlp-bk"></div>
    <div class="info-box"><span class="hl">// SENTIMENT GAUGE</span></div>
    <div class="gauge-wrap"><div class="gauge-label">😡</div><div class="gauge-bar"><div class="gauge-needle" id="nlp-needle"></div></div><div class="gauge-label">😊</div></div>
    <div class="stat-grid" id="nlp-st"></div>
    <div class="info-box" id="nlp-nf"><span class="hl">// HIGHLIGHTED WORDS</span> — <span style="color:#00cc66">positive</span> and <span style="color:#ff4444">negative</span> triggers</div>
    <div id="nlp-hl" style="font-family:'Share Tech Mono',monospace;font-size:.7rem;line-height:2;padding:.5rem"></div>`;
    $('nlp-in').oninput = analyze;
    function analyze() {
        const text = $('nlp-in').value.toLowerCase();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        // Bag of words
        const freq = {}; words.forEach(w => { const clean = w.replace(/[^a-z]/g, ''); if (clean) freq[clean] = (freq[clean] || 0) + 1; });
        $('nlp-bk').innerHTML = Object.entries(freq).map(([w, c]) => {
            const isP = POS.includes(w), isN = NEG.includes(w);
            const col = isP ? '#00cc66' : isN ? '#ff4444' : 'var(--bone)';
            return `<div class="word-chip" style="border-color:${col}">${w}<span class="cnt" style="color:${col}">×${c}</span></div>`;
        }).join('') || '<span style="font-family:\'Share Tech Mono\',monospace;font-size:.5rem;color:var(--ash)">// type to see word counts</span>';
        // Sentiment
        let score = 0; words.forEach(w => { const c = w.replace(/[^a-z]/g, ''); if (POS.includes(c)) score++; if (NEG.includes(c)) score--; });
        const norm = Math.max(-1, Math.min(1, words.length ? score / Math.sqrt(words.length) : 0));
        const pct = (norm + 1) / 2 * 100;
        $('nlp-needle').style.left = pct + '%';
        const labels = ['VERY NEGATIVE', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'VERY POSITIVE'];
        const li = Math.min(4, Math.max(0, Math.floor(pct / 20)));
        // Highlighted text
        $('nlp-hl').innerHTML = words.map(w => { const c = w.replace(/[^a-z]/g, ''); if (POS.includes(c)) return `<span style="color:#00cc66;font-weight:bold;text-decoration:underline">${w}</span>`; if (NEG.includes(c)) return `<span style="color:#ff4444;font-weight:bold;text-decoration:underline">${w}</span>`; return `<span style="color:var(--ash)">${w}</span>`; }).join(' ');
        $('nlp-st').innerHTML = `<div class="stat-card"><div class="stat-label">WORDS</div><div class="stat-value">${words.length}</div></div><div class="stat-card"><div class="stat-label">UNIQUE</div><div class="stat-value">${Object.keys(freq).length}</div></div><div class="stat-card"><div class="stat-label">SCORE</div><div class="stat-value">${score >= 0 ? '+' : ''}${score}</div></div><div class="stat-card"><div class="stat-label">SENTIMENT</div><div class="stat-value">${labels[li]}</div></div>`;
        addXP(1);
    }
};

/* ─── 8: DEEP LEARNING ─── */
MODULES.deeplearn = function (stage) {
    let layers = [3, 4, 3, 2], weights = [];
    function initWeights() { weights = []; for (let i = 0; i < layers.length - 1; i++) { const w = []; for (let j = 0; j < layers[i]; j++) { const row = []; for (let k = 0; k < layers[i + 1]; k++)row.push(Math.random() * 2 - 1); w.push(row); } weights.push(w); } }
    initWeights();
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🧠</div><div class="module-name">DIGITAL BRAIN</div><div class="module-desc">Click to add neurons and layers. Watch connections glow as weights change.</div></div>
    <div class="ctrl-bar"><button class="ctrl-btn" id="nn-al">+ LAYER</button><button class="ctrl-btn" id="nn-an">+ NEURON</button><button class="ctrl-btn" id="nn-rn">- NEURON</button><button class="ctrl-btn" id="nn-rw">RANDOMIZE</button><button class="ctrl-btn" id="nn-rst">RESET</button>
    <span class="ctrl-label" style="margin-left:auto">LAYERS: <span id="nn-lc">${layers.length}</span></span></div>
    <div class="canvas-wrap"><canvas id="nn-cv" height="350"></canvas></div>
    <div class="stat-grid" id="nn-st"></div><div class="info-box" id="nn-nf"><span class="hl">// ANN</span> — Each edge brightness = weight magnitude. Add layers/neurons to build your network.</div>`;
    const cv = $('nn-cv'), cx = cv.getContext('2d');
    function rsz() { cv.width = cv.parentElement.clientWidth; cv.height = 350; draw(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    $('nn-al').onclick = () => { if (layers.length >= 8) return; layers.splice(layers.length - 1, 0, 3); initWeights(); draw(); addXP(2); };
    $('nn-an').onclick = () => { const mid = Math.floor(layers.length / 2); if (layers[mid] >= 8) return; layers[mid]++; initWeights(); draw(); addXP(1); };
    $('nn-rn').onclick = () => { const mid = Math.floor(layers.length / 2); if (layers[mid] <= 1) return; layers[mid]--; initWeights(); draw(); };
    $('nn-rw').onclick = () => { initWeights(); draw(); addXP(1); };
    $('nn-rst').onclick = () => { layers = [3, 4, 3, 2]; initWeights(); draw(); };
    function draw() {
        const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H);
        const maxN = Math.max(...layers);
        const lx = layers.map((_, i) => 60 + (W - 120) * i / (layers.length - 1));
        const positions = layers.map((n, li) => Array.from({ length: n }, (_, ni) => ({ x: lx[li], y: H / 2 + (ni - (n - 1) / 2) * Math.min(50, H / (maxN + 1)) })));
        // Edges
        for (let l = 0; l < layers.length - 1; l++) {
            for (let i = 0; i < layers[l]; i++) {
                for (let j = 0; j < layers[l + 1]; j++) {
                    const w = weights[l] && weights[l][i] ? weights[l][i][j] || 0 : 0;
                    const abs = Math.abs(w);
                    cx.beginPath(); cx.moveTo(positions[l][i].x, positions[l][i].y); cx.lineTo(positions[l + 1][j].x, positions[l + 1][j].y);
                    cx.strokeStyle = w >= 0 ? `rgba(0,204,102,${abs * 0.6})` : `rgba(220,20,60,${abs * 0.6})`;
                    cx.lineWidth = 1 + abs * 2; cx.stroke();
                }
            }
        }
        // Nodes
        const layerNames = ['INPUT', ...Array(layers.length - 2).fill('HIDDEN'), 'OUTPUT'];
        positions.forEach((layer, li) => {
            layer.forEach((pos, ni) => {
                cx.beginPath(); cx.arc(pos.x, pos.y, 12, 0, Math.PI * 2);
                const grd = cx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 12);
                grd.addColorStop(0, li === 0 ? '#4488ff' : li === layers.length - 1 ? '#ff4444' : '#ffaa00');
                grd.addColorStop(1, 'rgba(0,0,0,0.3)');
                cx.fillStyle = grd; cx.fill(); cx.strokeStyle = 'rgba(255,255,255,0.3)'; cx.lineWidth = 1; cx.stroke();
            });
            cx.fillStyle = 'rgba(255,255,255,0.3)'; cx.font = '10px "Share Tech Mono"'; cx.textAlign = 'center';
            cx.fillText(layerNames[li], lx[li], H - 10);
        });
        $('nn-lc').textContent = layers.length;
        const totalParams = weights.reduce((s, l) => s + l.reduce((s2, r) => s2 + r.length, 0), 0);
        $('nn-st').innerHTML = `<div class="stat-card"><div class="stat-label">LAYERS</div><div class="stat-value">${layers.length}</div></div><div class="stat-card"><div class="stat-label">NEURONS</div><div class="stat-value">${layers.reduce((a, b) => a + b, 0)}</div></div><div class="stat-card"><div class="stat-label">PARAMETERS</div><div class="stat-value">${totalParams}</div></div><div class="stat-card"><div class="stat-label">ARCHITECTURE</div><div class="stat-value">${layers.join('-')}</div></div>`;
    }
    draw();
};

/* ─── 9: DIMENSIONALITY REDUCTION ─── */
MODULES.dimreduce = function (stage) {
    let rotX = 0.5, rotY = 0.3, dragging = false, lastMx = 0, lastMy = 0;
    // 3D points (cube with some noise)
    const pts3d = [];
    for (let i = 0; i < 60; i++)pts3d.push({ x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: (Math.random() - .5) * 2 });
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🔦</div><div class="module-name">SHADOW CASTER</div><div class="module-desc">Rotate the 3D object to find the best 2D shadow. PCA finds the optimal angle automatically.</div></div>
    <div class="ctrl-bar"><button class="ctrl-btn" id="pca-auto">🔦 PCA AUTO-FIND</button><button class="ctrl-btn" id="pca-rst">RESET ROTATION</button>
    <span class="ctrl-label" style="margin-left:auto">DRAG TO ROTATE</span></div>
    <div class="pca-wrap"><div class="pca-3d"><div class="info-box"><span class="hl">// 3D OBJECT</span></div><div class="canvas-wrap"><canvas id="pca-3" height="300"></canvas></div></div>
    <div class="pca-2d"><div class="info-box"><span class="hl">// 2D SHADOW (PROJECTION)</span></div><div class="canvas-wrap"><canvas id="pca-2" height="300"></canvas></div></div></div>
    <div class="stat-grid" id="pca-st"></div>`;
    const cv3 = $('pca-3'), cx3 = cv3.getContext('2d'), cv2 = $('pca-2'), cx2 = cv2.getContext('2d');
    function rsz() { cv3.width = cv3.parentElement.clientWidth; cv3.height = 300; cv2.width = cv2.parentElement.clientWidth; cv2.height = 300; draw(); }
    window.addEventListener('resize', rsz); setTimeout(rsz, 50);
    cv3.onmousedown = e => { dragging = true; lastMx = e.clientX; lastMy = e.clientY; };
    window.addEventListener('mousemove', e => { if (!dragging) return; rotY += (e.clientX - lastMx) * .01; rotX += (e.clientY - lastMy) * .01; lastMx = e.clientX; lastMy = e.clientY; draw(); });
    window.addEventListener('mouseup', () => { dragging = false; });
    $('pca-auto').onclick = () => {
        // Simple PCA: find direction of max variance
        const mx = pts3d.reduce((a, p) => a + p.x, 0) / pts3d.length, my = pts3d.reduce((a, p) => a + p.y, 0) / pts3d.length, mz = pts3d.reduce((a, p) => a + p.z, 0) / pts3d.length;
        let bestVar = 0, bestRx = 0, bestRy = 0;
        for (let rx = 0; rx < Math.PI; rx += .1)for (let ry = 0; ry < Math.PI * 2; ry += .1) {
            const proj = pts3d.map(p => project(p, rx, ry));
            const vx = variance(proj.map(p => p.x)), vy = variance(proj.map(p => p.y)), v = vx + vy;
            if (v > bestVar) { bestVar = v; bestRx = rx; bestRy = ry; }
        }
        animateTo(bestRx, bestRy); addXP(5);
    };
    $('pca-rst').onclick = () => { rotX = 0.5; rotY = 0.3; draw(); };
    function variance(arr) { const m = arr.reduce((a, b) => a + b, 0) / arr.length; return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length; }
    function animateTo(tx, ty) {
        const sx = rotX, sy = rotY, dur = 600, start = performance.now();
        function frame(t) { const p = Math.min(1, (t - start) / dur); const ep = 1 - (1 - p) * (1 - p); rotX = sx + (tx - sx) * ep; rotY = sy + (ty - sy) * ep; draw(); if (p < 1) requestAnimationFrame(frame); }
        requestAnimationFrame(frame);
    }
    function project(p, rx, ry) {
        let x = p.x, y = p.y, z = p.z;
        // Rotate around X
        let y1 = y * Math.cos(rx) - z * Math.sin(rx), z1 = y * Math.sin(rx) + z * Math.cos(rx);
        // Rotate around Y
        let x2 = x * Math.cos(ry) + z1 * Math.sin(ry), z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
        return { x: x2, y: y1, z: z2 };
    }
    function draw() {
        // 3D view
        const W3 = cv3.width, H3 = cv3.height; cx3.clearRect(0, 0, W3, H3);
        const proj3 = pts3d.map(p => project(p, rotX, rotY));
        const scale = Math.min(W3, H3) / 4;
        // Axes
        const axes = [{ v: { x: 1, y: 0, z: 0 }, c: '#ff4444', l: 'X' }, { v: { x: 0, y: 1, z: 0 }, c: '#00cc66', l: 'Y' }, { v: { x: 0, y: 0, z: 1 }, c: '#4488ff', l: 'Z' }];
        axes.forEach(a => { const p = project(a.v, rotX, rotY); cx3.beginPath(); cx3.moveTo(W3 / 2, H3 / 2); cx3.lineTo(W3 / 2 + p.x * scale * .8, H3 / 2 - p.y * scale * .8); cx3.strokeStyle = a.c; cx3.lineWidth = 1; cx3.stroke(); cx3.fillStyle = a.c; cx3.font = '10px monospace'; cx3.fillText(a.l, W3 / 2 + p.x * scale * .9, H3 / 2 - p.y * scale * .9); });
        // Points (sorted by depth)
        const sorted = proj3.map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z);
        sorted.forEach(p => {
            const sx = W3 / 2 + p.x * scale, sy = H3 / 2 - p.y * scale;
            const depth = (p.z + 2) / 4;
            cx3.beginPath(); cx3.arc(sx, sy, 3 + depth * 3, 0, Math.PI * 2);
            cx3.fillStyle = `rgba(220,20,60,${0.3 + depth * 0.5})`; cx3.fill();
        });
        // 2D shadow
        const W2 = cv2.width, H2 = cv2.height; cx2.clearRect(0, 0, W2, H2);
        const scale2 = Math.min(W2, H2) / 4;
        // Light lines from 3D to 2D
        proj3.forEach(p => {
            const sx = W2 / 2 + p.x * scale2, sy = H2 / 2 - p.y * scale2;
            cx2.beginPath(); cx2.arc(sx, sy, 4, 0, Math.PI * 2); cx2.fillStyle = 'rgba(220,20,60,0.7)'; cx2.fill(); cx2.strokeStyle = 'rgba(220,20,60,0.3)'; cx2.lineWidth = 1; cx2.stroke();
        });
        // Stats
        const projX = proj3.map(p => p.x), projY = proj3.map(p => p.y);
        const vx = variance(projX), vy = variance(projY);
        $('pca-st').innerHTML = `<div class="stat-card"><div class="stat-label">VAR PC1</div><div class="stat-value">${vx.toFixed(3)}</div></div><div class="stat-card"><div class="stat-label">VAR PC2</div><div class="stat-value">${vy.toFixed(3)}</div></div><div class="stat-card"><div class="stat-label">TOTAL VAR</div><div class="stat-value">${(vx + vy).toFixed(3)}</div></div><div class="stat-card"><div class="stat-label">ROTATION</div><div class="stat-value">${(rotX * 180 / Math.PI).toFixed(0)}°,${(rotY * 180 / Math.PI).toFixed(0)}°</div></div>`;
    }
    draw();
};

/* ─── 10: MODEL SELECTION & BOOSTING ─── */
MODULES.boosting = function (stage) {
    let folds = 5, currentFold = 0, foldTimer = null, foldRunning = false;
    let xgbStep = 0, xgbTimer = null, xgbRunning = false;
    stage.innerHTML = `<div class="module-header"><div class="module-icon">🏆</div><div class="module-name">PERFORMANCE LAB</div><div class="module-desc">K-Fold cross validation + XGBoost weak learner ensemble.</div></div>
    <div class="info-box"><span class="hl">// K-FOLD CROSS VALIDATION</span></div>
    <div class="ctrl-bar"><span class="ctrl-label">K=<span id="kf-v">5</span></span><input type="range" class="ctrl-slider" id="kf-s" min="3" max="10" value="5">
    <button class="ctrl-btn" id="kf-play">▶ ANIMATE</button><button class="ctrl-btn" id="kf-rst">RESET</button></div>
    <div class="fold-row" id="kf-row"></div>
    <div class="stat-grid" id="kf-st"></div>
    <div style="margin-top:2rem"><div class="info-box"><span class="hl">// XGBOOST — TEAM OF WEAKLINGS</span></div></div>
    <div class="ctrl-bar"><button class="ctrl-btn" id="xg-play">▶ BUILD ENSEMBLE</button><button class="ctrl-btn" id="xg-step">STEP</button><button class="ctrl-btn" id="xg-rst">RESET</button></div>
    <div class="tree-row" id="xg-row"></div>
    <div class="stat-grid" id="xg-st"></div><div class="info-box" id="xg-nf"><span class="hl">// XGBOOST</span> — Each weak tree focuses on the previous tree's errors.</div>`;
    // K-Fold
    $('kf-s').oninput = e => { folds = +e.target.value; $('kf-v').textContent = folds; currentFold = 0; renderFolds(); };
    function renderFolds() {
        $('kf-row').innerHTML = Array.from({ length: folds }, (_, i) => `<div class="fold-block ${i === currentFold ? 'test' : 'train'}">FOLD ${i + 1}${i === currentFold ? ' (TEST)' : ''}</div>`).join('');
        const scores = [.82, .85, .79, .88, .84, .81, .86, .83, .87, .80];
        $('kf-st').innerHTML = `<div class="stat-card"><div class="stat-label">CURRENT FOLD</div><div class="stat-value">${currentFold + 1}/${folds}</div></div><div class="stat-card"><div class="stat-label">FOLD ACCURACY</div><div class="stat-value">${(scores[currentFold % scores.length] * 100).toFixed(1)}%</div></div><div class="stat-card"><div class="stat-label">AVG ACCURACY</div><div class="stat-value">${(scores.slice(0, folds).reduce((a, b) => a + b, 0) / folds * 100).toFixed(1)}%</div></div><div class="stat-card"><div class="stat-label">STD DEV</div><div class="stat-value">±${(Math.sqrt(scores.slice(0, folds).reduce((s, v, _, a) => s + (v - a.reduce((x, y) => x + y, 0) / a.length) ** 2, 0) / folds) * 100).toFixed(1)}%</div></div>`;
    }
    renderFolds();
    $('kf-play').onclick = () => { if (foldRunning) { clearInterval(foldTimer); foldRunning = false; $('kf-play').textContent = '▶ ANIMATE'; return; } foldRunning = true; $('kf-play').textContent = '⏸ PAUSE'; foldTimer = setInterval(() => { currentFold = (currentFold + 1) % folds; renderFolds(); addXP(1); }, 800); };
    $('kf-rst').onclick = () => { currentFold = 0; foldRunning = false; clearInterval(foldTimer); $('kf-play').textContent = '▶ ANIMATE'; renderFolds(); };
    // XGBoost
    const TREES = [
        { name: 'Tree 1', acc: 52, err: 'High bias, underfitting', focus: 'Full dataset' },
        { name: 'Tree 2', acc: 61, err: 'Focuses on Tree 1 errors', focus: 'Residuals of T1' },
        { name: 'Tree 3', acc: 68, err: 'Corrects remaining gaps', focus: 'Residuals of T1+T2' },
        { name: 'Tree 4', acc: 74, err: 'Fine-tuning boundaries', focus: 'Residuals of T1+T2+T3' },
        { name: 'Tree 5', acc: 79, err: 'Nearly converged', focus: 'Small residuals' },
        { name: 'Ensemble', acc: 88, err: 'Strong learner!', focus: 'All trees combined' },
    ];
    function renderTrees() {
        $('xg-row').innerHTML = TREES.map((t, i) => {
            const active = i < xgbStep; const combined = i === TREES.length - 1 && xgbStep >= TREES.length;
            return `<div class="weak-tree${active ? ' active' : ''}${combined ? ' combined' : ''}">
        <div style="font-family:'Cinzel',serif;font-size:.6rem;color:${combined ? 'var(--gold)' : 'var(--bone)'};letter-spacing:.1em;margin-bottom:.3rem">${t.name}</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:1.2rem;color:${combined ? 'var(--gold)' : t.acc > 70 ? '#00cc66' : 'var(--crimson)}'}">${active || combined ? t.acc + '%' : '??'}</div>
        <div style="font-family:'Share Tech Mono',monospace;font-size:.45rem;color:var(--ash);margin-top:.3rem">${active || combined ? t.err : '...'}</div>
      </div>`;
        }).join('');
        const cur = TREES[Math.min(xgbStep, TREES.length - 1)];
        $('xg-st').innerHTML = `<div class="stat-card"><div class="stat-label">TREES BUILT</div><div class="stat-value">${Math.min(xgbStep, 5)}/5</div></div><div class="stat-card"><div class="stat-label">CURRENT ACC</div><div class="stat-value">${xgbStep > 0 ? TREES[Math.min(xgbStep - 1, TREES.length - 1)].acc + '%' : '—'}</div></div><div class="stat-card"><div class="stat-label">FOCUS</div><div class="stat-value">${xgbStep > 0 ? cur.focus : '—'}</div></div><div class="stat-card"><div class="stat-label">ALGO</div><div class="stat-value">XGBOOST</div></div>`;
    }
    renderTrees();
    $('xg-step').onclick = () => { if (xgbStep <= TREES.length) { xgbStep++; renderTrees(); addXP(2); } };
    $('xg-play').onclick = () => { if (xgbRunning) { clearInterval(xgbTimer); xgbRunning = false; $('xg-play').textContent = '▶ BUILD ENSEMBLE'; return; } xgbRunning = true; xgbStep = 0; $('xg-play').textContent = '⏸ PAUSE'; xgbTimer = setInterval(() => { xgbStep++; renderTrees(); addXP(1); if (xgbStep > TREES.length) { clearInterval(xgbTimer); xgbRunning = false; $('xg-play').textContent = '▶ BUILD ENSEMBLE'; $('xg-nf').innerHTML = '<span class="hl">// ✅ ENSEMBLE COMPLETE</span> — 5 weak trees combined into one strong model: 52% → 88%!'; } }, 700); };
    $('xg-rst').onclick = () => { xgbStep = 0; xgbRunning = false; clearInterval(xgbTimer); $('xg-play').textContent = '▶ BUILD ENSEMBLE'; renderTrees(); $('xg-nf').innerHTML = '<span class="hl">// XGBOOST</span> — Each weak tree focuses on the previous tree\'s errors.'; };
};
