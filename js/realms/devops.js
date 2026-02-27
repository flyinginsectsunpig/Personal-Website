import {$,  DOM, setText, setMetricDisplay } from '../config/dom.js';
import { toast } from '../ui/toast.js';

// DEVOPS REALM
// ═══════════════════════════════════════
export let pipelineStages = [];
export let deployStreak = 0, deployCount = 0;    // deployCount kept for backward compat; doraMetrics is source of truth

export function initDevOps() {
  pipelineStages = [];
  deployStreak = 0;
  deployCount = 0;
  doraMetrics = { deploys: 0, successes: 0, failures: 0, totalLeadTime: 0, totalMttr: 0, mttrCount: 0 };
  setupDragDrop();
}

export let setupDragDropDone = false;
export let draggedPlacedStage = null;

export function onPlacedDragStart(e, stage) {
  e.dataTransfer.setData('placed-stage', stage);
  draggedPlacedStage = stage;
  setTimeout(() => e.target.style.opacity = '0.5', 0);
}
export function onPlacedDragEnd(e) {
  e.target.style.opacity = '1';
  draggedPlacedStage = null;
}
export function onPlacedDragOver(e, targetStage) {
  e.preventDefault();
}
export function onPlacedDrop(e, targetStage) {
  e.preventDefault();
  e.stopPropagation();
  const sourceStage = e.dataTransfer.getData('placed-stage');
  if (sourceStage && sourceStage !== targetStage) {
    const fromIdx = pipelineStages.indexOf(sourceStage);
    const toIdx = pipelineStages.indexOf(targetStage);
    if (fromIdx > -1 && toIdx > -1) {
      pipelineStages.splice(fromIdx, 1);
      pipelineStages.splice(toIdx, 0, sourceStage);
      renderTrack();
    }
  }
}

export function setupDragDrop() {
  if (setupDragDropDone) return;
  setupDragDropDone = true;

  const pool = $('stage-pool');
  const track = $('pipeline-track');

  pool.querySelectorAll('.pipeline-stage').forEach(stage => {
    stage.addEventListener('dragstart', e => {
      e.dataTransfer.setData('stage', stage.dataset.stage);
      stage.classList.add('dragging');
    });
    stage.addEventListener('dragend', () => stage.classList.remove('dragging'));
  });

  track.addEventListener('dragover', e => { e.preventDefault(); track.classList.add('drag-over'); });
  track.addEventListener('dragleave', () => track.classList.remove('drag-over'));
  track.addEventListener('drop', e => {
    e.preventDefault();
    track.classList.remove('drag-over');
    const stageId = e.dataTransfer.getData('stage');
    if (stageId && !pipelineStages.includes(stageId)) {
      pipelineStages.push(stageId);
      renderTrack();
    }
    const placedId = e.dataTransfer.getData('placed-stage');
    if (placedId) {
      const fromIdx = pipelineStages.indexOf(placedId);
      if (fromIdx > -1) {
        pipelineStages.splice(fromIdx, 1);
        pipelineStages.push(placedId);
        renderTrack();
      }
    }
  });

  document.addEventListener('dragover', e => {
    if (draggedPlacedStage) e.preventDefault();
  });
  document.addEventListener('drop', e => {
    if (draggedPlacedStage && !e.target.closest('#pipeline-track')) {
      removePipelineStage(draggedPlacedStage);
    }
  });
}

export function renderTrack() {
  const track = $('pipeline-track');
  if (pipelineStages.length === 0) {
    track.classList.add('empty');
    track.innerHTML = '';
    return;
  }
  track.classList.remove('empty');
  const labels = {
    'source': '📁 SOURCE', 'lint': '🔍 LINT', 'unit-test': '🧪 UNIT TESTS',
    'integration': '🔗 INTEGRATION', 'security': '🔐 SECURITY', 'build': '🏗 BUILD',
    'docker': '🐳 DOCKERIZE', 'staging': '🌐 STAGING', 'canary': '🐦 CANARY',
    'prod': '🚀 PROD', 'monitor': '📊 MONITOR'
  };
  track.innerHTML = pipelineStages.map((s, i) => `
    <div class="pipeline-stage-placed" id="placed-${s}" draggable="true"
         onclick="removePipelineStage('${s}')"
         ondragstart="onPlacedDragStart(event, '${s}')"
         ondragend="onPlacedDragEnd(event)"
         ondragover="onPlacedDragOver(event, '${s}')"
         ondrop="onPlacedDrop(event, '${s}')">
      ${labels[s] || s}
    </div>
    ${i < pipelineStages.length - 1 ? '<span style="color:var(--blood);font-size:0.8rem;pointer-events:none">→</span>' : ''}
  `).join('');
}

export function removePipelineStage(stage) {
  pipelineStages = pipelineStages.filter(s => s !== stage);
  renderTrack();
}

export function clearPipeline() {
  pipelineStages = [];
  renderTrack();
  $('pipeline-result').innerHTML = '';
}

// Stage failure probabilities — based on real CI/CD failure patterns
export const STAGE_FAIL_BASE = {
  'source': 0.02, 'lint': 0.08, 'unit-test': 0.12, 'integration': 0.20,
  'security': 0.15, 'build': 0.05, 'docker': 0.04, 'staging': 0.10,
  'canary': 0.06, 'prod': 0.04, 'monitor': 0.01
};

// Stage durations (ms) simulate real build time
export const STAGE_DURATION = {
  'source': 300, 'lint': 500, 'unit-test': 900, 'integration': 1400,
  'security': 800, 'build': 1100, 'docker': 700, 'staging': 600,
  'canary': 500, 'prod': 400, 'monitor': 300
};

// Session-accumulated DORA metrics
export let doraMetrics = { deploys: 0, successes: 0, failures: 0, totalLeadTime: 0, totalMttr: 0, mttrCount: 0 };

/** Contextual failure reasons per stage — used by _executePipeline. */
export const STAGE_FAIL_REASONS = {
  'unit-test': ['assertion failed: expected 200 got 500', 'NullPointerException in UserService.java:143', '3 tests failed, 47 passed'],
  'integration': ['timeout: external service 504', 'DB connection pool exhausted', 'schema mismatch on v2 endpoint'],
  'security': ['CVE-2024-1234 in dependency', 'hardcoded secret detected', 'OWASP: SQL injection risk'],
  'lint': ['line 247: unused import', 'max line length exceeded (142 > 100)', '2 linting violations'],
  'build': ['compilation error: missing dependency', 'OOM during build: heap exhausted', 'module resolution failed'],
  'prod': ['health check failed (3/3 attempts)', 'rollout timeout exceeded', 'pod CrashLoopBackoff'],
};

/** Success log message per stage. Functions receive stage duration for realistic timing. */
export const STAGE_SUCCESS_MSGS = {
  source: _dur => `📁 source cloned — ${Math.floor(Math.random() * 50 + 20)} files changed`,
  lint: _dur => `🔍 lint clean — ${Math.floor(Math.random() * 200 + 800)} lines checked`,
  'unit-test': dur => `🧪 ${Math.floor(Math.random() * 20 + 80)} tests passed (${(dur / 1000).toFixed(1)}s)`,
  integration: _dur => `🔗 integration OK — 12 endpoints verified`,
  security: _dur => '🔐 no critical CVEs — scan complete',
  build: _dur => `🏗 build succeeded — ${(Math.random() * 2 + 1).toFixed(1)}MB artifact`,
  docker: _dur => '🐳 image pushed to registry',
  staging: _dur => `🌐 staging healthy — p95 latency ${Math.floor(Math.random() * 30 + 20)}ms`,
  canary: _dur => `🐦 canary stable — error rate ${(Math.random() * 0.5).toFixed(2)}%`,
  prod: _dur => `🚀 prod deployed — ${Math.floor(Math.random() * 3 + 1)} replicas updated`,
  monitor: _dur => '📊 dashboards live — alerting armed',
};

/** Module-level pipeline logger — prepends entries to the pipeline log panel. */
export function plog(msg, type = '') {
  const pipLog = $('pipeline-log');
  if (!pipLog) return;
  const d = document.createElement('div');
  d.className = 'log-entry ' + type;
  d.textContent = msg;
  pipLog.prepend(d);
}

export async function runPipeline() {
  if (pipelineStages.length < 3) { toast('Add at least 3 stages!', 'warn'); return; }

  try {
    await _executePipeline();
  } catch (err) {
    toast('Pipeline runner encountered an unexpected error', 'warn');
    plog('❌ Pipeline runner error — check console', 'danger');
    console.error('runPipeline:', err);
  }
}

/** Inner pipeline execution — separated so try/catch in runPipeline stays readable. */
async function _executePipeline() {
  // Analyse pipeline shape — affects failure multipliers
  const has = s => pipelineStages.includes(s);
  const hasTests = has('unit-test') || has('integration');
  const hasBuild = has('build') || has('docker');
  const hasMonitor = has('monitor');
  const hasSecurity = has('security');
  const hasCanary = has('canary');
  const hasStaging = has('staging');
  const correctOrder = pipelineStages.indexOf('source') <= 0;

  // Failure probability multipliers driven by pipeline quality
  const failMult = {
    'prod': hasBuild && hasTests ? 0.3 : !hasTests ? 3.5 : !hasBuild ? 4.0 : 1.0,
    'integration': hasTests ? 1.0 : 1.8,
    'canary': hasStaging ? 0.5 : 1.4,
    'unit-test': correctOrder ? 1.0 : 1.5,
  };

  const pipLog = $('pipeline-log');
  if (pipLog) pipLog.innerHTML = '';

  doraMetrics.deploys++;
  deployCount++;
  const runStart = Date.now();
  const commitHash = ['a3f9c12', 'b72e841', 'c91d3f7', 'd45ab20', 'e18c63f'][Math.floor(Math.random() * 5)];

  plog(`// commit ${commitHash} triggered pipeline`, 'good');
  setText($('dv-freq'), doraMetrics.deploys + ' this session');

  let failed = false;
  let failedStage = null;

  for (const s of pipelineStages) {
    const el = $('placed-' + s);
    if (el) el.classList.add('running');

    const dur = (STAGE_DURATION[s] || 600) + Math.floor(Math.random() * 300);
    await delay(dur);

    const baseChance = STAGE_FAIL_BASE[s] || 0.05;
    const mult = failMult[s] || 1.0;
    const fatigue = Math.min(1.5, 1 + doraMetrics.deploys * 0.03);
    const failChance = Math.min(0.95, baseChance * mult * fatigue);

    if (Math.random() < failChance) {
      if (el) { el.classList.remove('running'); el.classList.add('failed'); }
      const reasons = STAGE_FAIL_REASONS[s] || ['unexpected error'];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      plog(`❌ ${s.toUpperCase()} FAILED — ${reason}`, 'danger');
      failed = true;
      failedStage = s;
      break;
    }

    if (el) { el.classList.remove('running'); el.classList.add('passed'); }
    plog(STAGE_SUCCESS_MSGS[s]?.(dur) ?? `✅ ${s} passed`, 'good');
  }

  const leadTime = ((Date.now() - runStart) / 1000).toFixed(1);
  doraMetrics.totalLeadTime += parseFloat(leadTime);

  if (failed) {
    _handlePipelineFailure(failedStage, hasTests, hasStaging);
  } else {
    _handlePipelineSuccess(hasTests, hasBuild, hasMonitor, hasSecurity, hasCanary, hasStaging);
  }
}

export function _handlePipelineFailure(failedStage, hasTests, hasStaging) {
  doraMetrics.failures++;
  deployStreak = 0;
  const mttr = Math.floor(Math.random() * 20 + 5);
  doraMetrics.totalMttr += mttr;
  doraMetrics.mttrCount++;

  setText($('deploy-streak'), '0');
  setText($('dv-fail'), Math.round(doraMetrics.failures / doraMetrics.deploys * 100) + '%');
  setText($('dv-mttr'), Math.round(doraMetrics.totalMttr / doraMetrics.mttrCount) + 'min');
  setText($('dv-lead'), (doraMetrics.totalLeadTime / doraMetrics.deploys).toFixed(1) + 's');

  plog(`// MTTR estimate: ${mttr}min — fix ${failedStage} and redeploy`, 'warn');
  toast(`❌ Failed at ${failedStage}! Streak reset.`, 'warn');

  if (failedStage === 'prod' && !hasTests) plog('💡 Add unit-test + integration before prod', 'warn');
  if (failedStage === 'security') plog('💡 Run security scan before build stage', 'warn');
  if (failedStage === 'integration' && !hasStaging) plog('💡 Add staging before integration tests', 'warn');
}

export function _handlePipelineSuccess(hasTests, hasBuild, hasMonitor, hasSecurity, hasCanary, hasStaging) {
  doraMetrics.successes++;
  deployStreak++;

  const avgLead = (doraMetrics.totalLeadTime / doraMetrics.deploys).toFixed(1);
  const failRate = Math.round(doraMetrics.failures / doraMetrics.deploys * 100);
  const avgMttr = doraMetrics.mttrCount > 0
    ? Math.round(doraMetrics.totalMttr / doraMetrics.mttrCount) + 'min'
    : 'N/A';

  setText($('deploy-streak'), String(deployStreak));
  setText($('dv-lead'), avgLead + 's');
  setText($('dv-fail'), failRate + '%');
  setText($('dv-mttr'), hasMonitor ? avgMttr : '?');

  let quality = 0;
  if (hasTests) quality += 30;
  if (hasBuild) quality += 20;
  if (hasMonitor) quality += 20;
  if (hasSecurity) quality += 15;
  if (hasCanary) quality += 10;
  if (hasStaging) quality += 5;
  plog(`🚀 DEPLOY SUCCESS — quality: ${quality}% — streak: ${deployStreak}`, 'good');
  toast(`✅ Deployed! Quality: ${quality}% | Streak: ${deployStreak}`, 'success');

  if (!hasMonitor) plog('⚠ No monitor — flying blind in prod', 'warn');
  if (!hasSecurity) plog('⚠ No security scan — unknown vulnerabilities', 'warn');
  if (!hasCanary && !hasStaging) plog('⚠ Direct to prod — consider canary or staging', 'warn');
  if (!hasTests) plog('⚠ No tests — lucky this time', 'warn');
}

export function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
// ═══════════════════════════════════════
