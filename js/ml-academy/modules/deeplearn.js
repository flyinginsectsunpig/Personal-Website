import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function deeplearn(stage) {
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
}
