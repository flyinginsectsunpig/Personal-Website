import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function boosting(stage) {
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
        <div style="font-family:'Share Tech Mono',monospace;font-size:1.2rem;color:${combined ? 'var(--gold)' : t.acc > 70 ? '#00cc66' : 'var(--crimson)'}">${active || combined ? t.acc + '%' : '??'}</div>
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
}
