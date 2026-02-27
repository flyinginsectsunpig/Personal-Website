import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function dimreduce(stage) {
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
}
