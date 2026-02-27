import {$,  DOM, setText, setMetricDisplay } from '../config/dom.js';
import { toast } from '../ui/toast.js';
import { SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH } from '../config/constants.js';

    // SYSTEM REALM
    // ═══════════════════════════════════════
export let sysCanvas, sysCtx;
export let nodes = [], connections = [], selectedNodeType = null;
export let connectingFrom = null, trafficLevel = 0;
export let draggingNode = null, dragHasMoved = false, sysMousePos = null;
export let sysMetrics = { latency: 0, error: 0, throughput: 0, cache: 0 };
export let sysAnimFrame = null;
export let sysTickInterval = null;
export let lastAutoEvent = 0;
export let eventLog = [];

export function stopSystemSim() {
      if (sysTickInterval) { clearInterval(sysTickInterval); sysTickInterval = null; }
      if (sysAnimFrame) { cancelAnimationFrame(sysAnimFrame); sysAnimFrame = null; }
    }

    // Mutable simulation state — updated each tick
export const simState = { queueDepth: 0, cpuLoad: 0, memLoad: 0 };

export const NODE_TYPES = {
      'load-balancer': { color: '#DC143C', label: 'LB', full: 'Load Balancer' },
      'api-server': { color: '#C9A84C', label: 'API', full: 'API Server' },
      'cache': { color: '#00cc66', label: '⚡', full: 'Cache' },
      'database': { color: '#4488ff', label: 'DB', full: 'Database' },
      'queue': { color: '#ff8c00', label: '📬', full: 'Queue' },
      'replica': { color: '#aa66ff', label: 'R', full: 'DB Replica' },
    };

    // Traffic label per 20-unit band — index = Math.floor(trafficLevel / 20)
export const TRAFFIC_LABELS = ['IDLE', 'LOW TRAFFIC', 'MODERATE', 'HIGH LOAD', 'DANGER ZONE', '💀 OVERLOAD'];

export function initSystemRealm() {
      sysCanvas = $('system-canvas');
      sysCtx = sysCanvas.getContext('2d');
      resizeSysCanvas();
      window.removeEventListener('resize', resizeSysCanvas);
      window.addEventListener('resize', resizeSysCanvas);

      sysCanvas.removeEventListener('mousedown', onSysCanvasMouseDown);
      sysCanvas.removeEventListener('mousemove', onSysCanvasMouseMove);
      sysCanvas.removeEventListener('mouseup', onSysCanvasMouseUp);
      sysCanvas.removeEventListener('mouseleave', onSysCanvasMouseLeave);
      sysCanvas.addEventListener('mousedown', onSysCanvasMouseDown);
      sysCanvas.addEventListener('mousemove', onSysCanvasMouseMove);
      sysCanvas.addEventListener('mouseup', onSysCanvasMouseUp);
      sysCanvas.addEventListener('mouseleave', onSysCanvasMouseLeave);

      nodes = []; connections = []; trafficLevel = 0;
      simState.queueDepth = 0; simState.cpuLoad = 0; simState.memLoad = 0;
      lastAutoEvent = 0;

      const slider = $('traffic-slider');
      if (slider) slider.value = 0;

      addLog('// system canvas ready');
      addLog('// place nodes, connect them, then increase traffic');
      stopSystemSim();
      drawSystem();
      sysTickInterval = setInterval(sysSimTick, SIM_TICK_MS);
    }

export function resizeSysCanvas() {
      if (!sysCanvas) return;
      const area = sysCanvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      sysCanvas.width = area.clientWidth * dpr;
      sysCanvas.style.width = area.clientWidth + 'px';
      sysCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sysCanvas.height = area.clientHeight * dpr;
      sysCanvas.style.height = area.clientHeight + 'px';
    }

export function updateTraffic(val) {
      trafficLevel = parseInt(val);
      const rps = trafficLevel * 120;
      const label = TRAFFIC_LABELS[Math.floor(trafficLevel / 20)] ?? TRAFFIC_LABELS[TRAFFIC_LABELS.length - 1];
      const rpsEl = $('traffic-rps');
      const lblEl = $('traffic-label');
      if (rpsEl) rpsEl.textContent = rps;
      if (lblEl) lblEl.textContent = label;
      sysSimTick();
    }

export function sysNodeDragStart(e, type) {
      e.dataTransfer.setData('text/plain', type);
      e.dataTransfer.effectAllowed = 'copy';
      selectNode(type);
    }

export function sysNodeDrop(e) {
      e.preventDefault();
      const type = e.dataTransfer.getData('text/plain');
      if (!type || !NODE_TYPES[type]) return;

      const rect = sysCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      nodes.push({ x, y, type, ...NODE_TYPES[type], id: Date.now(), health: 100 });
      addLog(`// dropped: ${NODE_TYPES[type].full} at (${Math.round(x)}, ${Math.round(y)})`);
      sysSimTick();

      selectedNodeType = null;
      document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
    }

export function selectNode(type) {
      selectedNodeType = type;
      connectingFrom = null;
      document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
      $('btn-' + (type === 'database' ? 'database-node' : type))?.classList.add('active');
    }

export function clearConnecting() {
      connectingFrom = null; selectedNodeType = null;
      document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
      toast('Click a node to start connection, then click another to connect', 'info');
    }

export function clearNodes() {
      nodes = []; connections = [];
      connectingFrom = null; selectedNodeType = null;
      document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
      addLog('// canvas cleared');
    }

export function distToSegment(px, py, x1, y1, x2, y2) {
      const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      const param = len_sq !== 0 ? dot / len_sq : -1;
      let xx, yy;
      if (param < 0) { xx = x1; yy = y1; }
      else if (param > 1) { xx = x2; yy = y2; }
      else { xx = x1 + param * C; yy = y1 + param * D; }
      const dx = px - xx, dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }

export function onSysCanvasMouseDown(e) {
      const rect = sysCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 30);

      if (e.shiftKey) {
        if (clicked) {
          nodes = nodes.filter(n => n !== clicked);
          connections = connections.filter(c => c.a !== clicked && c.b !== clicked);
          sysSimTick();
          addLog(`// deleted: ${clicked.full}`);
          return;
        }
        const hitConn = connections.find(c => distToSegment(x, y, c.a.x, c.a.y, c.b.x, c.b.y) < 15);
        if (hitConn) {
          connections = connections.filter(c => c !== hitConn);
          sysSimTick();
          addLog(`// deleted connection`);
          return;
        }
        return;
      }

      if (clicked) {
        draggingNode = clicked;
        dragHasMoved = false;
        return;
      }

      if (selectedNodeType) {
        const type = NODE_TYPES[selectedNodeType];
        nodes.push({ x, y, type: selectedNodeType, ...type, id: Date.now(), health: 100 });
        addLog(`// placed: ${type.full} at (${Math.round(x)}, ${Math.round(y)})`);
        sysSimTick();
        return;
      }

      // Allow clicking lines to delete them even without shift key
      const hitConn = connections.find(c => distToSegment(x, y, c.a.x, c.a.y, c.b.x, c.b.y) < 15);
      if (hitConn) {
        connections = connections.filter(c => c !== hitConn);
        sysSimTick();
        addLog(`// deleted connection`);
        return;
      }
    }

export function onSysCanvasMouseMove(e) {
      const rect = sysCanvas.getBoundingClientRect();
      sysMousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (draggingNode) {
        draggingNode.x = sysMousePos.x;
        draggingNode.y = sysMousePos.y;
        dragHasMoved = true;
      }
    }

export function onSysCanvasMouseUp(e) {
      if (draggingNode) {
        if (!dragHasMoved && !e.shiftKey) {
          const clicked = draggingNode;
          if (connectingFrom !== null) {
            if (clicked !== connectingFrom) {
              const alreadyLinked = connections.some(c =>
                (c.a === connectingFrom && c.b === clicked) ||
                (c.a === clicked && c.b === connectingFrom)
              );
              if (!alreadyLinked) {
                connections.push({ a: connectingFrom, b: clicked });
                addLog(`// connected: ${connectingFrom.full} → ${clicked.full}`);
                toast(`Connected: ${connectingFrom.full} ↔ ${clicked.full}`, 'success');
                sysSimTick();
              }
            }
            connectingFrom = null;
          } else {
            connectingFrom = clicked;
            toast(`Connecting from ${clicked.full} — click another node`, 'info');
          }
        }
        draggingNode = null;
        dragHasMoved = false;
      }
    }

export function onSysCanvasMouseLeave(e) {
      sysMousePos = null;
      draggingNode = null;
    }

    // ── Simulation — each function has one job ───────────────────────────────────

    /** Read node topology once per tick; all sim functions consume this. */
export function getTopology() {
      return {
        hasLB: nodes.some(n => n.type === 'load-balancer'),
        apiCount: nodes.filter(n => n.type === 'api-server' && n.health > 0).length,
        hasCache: nodes.some(n => n.type === 'cache'),
        hasQueue: nodes.some(n => n.type === 'queue'),
        rps: trafficLevel * 120,
      };
    }

    /** Mutate simState: queue depth, CPU load, memory load. */
export function stepSimState({ apiCount, hasLB, hasQueue, rps }) {
      const capacity = apiCount * 800 + (hasLB ? 400 : 0) + (hasQueue ? 600 : 0);
      const overflow = Math.max(0, rps - capacity);
      simState.queueDepth = Math.min(
        MAX_QUEUE_DEPTH,
        Math.max(0, simState.queueDepth + overflow * 0.1 - capacity * 0.05)
      );
      const perServer = apiCount > 0 ? rps / apiCount : rps;
      simState.cpuLoad = Math.min(100, perServer / 12 + (hasLB ? -8 : 0) + (Math.random() - 0.5) * 5);
      simState.memLoad = Math.min(100, simState.queueDepth / 50 + apiCount * 8 + (Math.random() - 0.5) * 3);
    }

    /** Derive latency, error rate, throughput and cache hit from topology + sim state. */
export function deriveMetrics({ hasLB, apiCount, hasCache, hasQueue }) {
      // Latency: queueing formula + jitter, dampened by architecture
      let latency = 60 + trafficLevel * 8 + simState.queueDepth * 0.8 + (Math.random() - 0.5) * 40;
      if (hasLB) latency *= 0.55;
      if (apiCount > 1) latency /= (0.4 + apiCount * 0.35);
      if (hasCache) latency *= 0.45;
      if (hasQueue) latency *= 0.65;
      latency = Math.max(2, Math.round(latency));

      // Error rate: grows with overload, dampened by LB + multi-API
      let error = trafficLevel > 40 ? (trafficLevel - 40) * 0.6 : 0;
      if (simState.queueDepth > 200) error += simState.queueDepth / 80;
      if (!hasLB && trafficLevel > 60) error += 15;
      if (apiCount === 0) error = 100;
      if (hasLB) error *= 0.35;
      if (apiCount > 1) error *= 0.25;
      error = Math.min(100, Math.round(error + (Math.random() - 0.5) * 3));

      const throughput = Math.min(100, Math.round(
        (connections.length * 10 + (hasLB ? 25 : 0) + (hasQueue ? 18 : 0) + apiCount * 12)
        * Math.max(0, 1 - error / 150) + (Math.random() - 0.5) * 4
      ));
      const cacheHit = hasCache
        ? Math.min(97, 35 + connections.length * 7 + (Math.random() - 0.5) * 4)
        : 0;

      return { latency, error, throughput, cacheHit };
    }

    /** Flush metrics to DOM using the shared setMetricDisplay helper. */
export function renderSysMetrics({ latency, error, throughput, cacheHit }) {
      const lClass = latency > 800 ? 'danger' : latency > 300 ? 'warn' : 'good';
      const eClass = error > 20 ? 'danger' : error > 5 ? 'warn' : 'good';
      const tClass = throughput > 60 ? 'good' : 'warn';
      const cpuCls = simState.cpuLoad > 80 ? 'danger' : simState.cpuLoad > 50 ? 'warn' : 'good';

      const mL = $('m-latency'), bL = $('b-latency');
      const mE = $('m-error'), bE = $('b-error');
      const mT = $('m-throughput'), bTh = $('b-throughput');
      const mC = $('m-cache'), bC = $('b-cache');

      if (mL) { mL.textContent = latency + 'ms'; mL.className = 'metric-value ' + lClass; }
      if (bL) { bL.style.width = Math.min(100, latency / 20) + '%'; bL.style.background = lClass === 'good' ? '#00cc66' : lClass === 'warn' ? '#ff8c00' : 'var(--crimson)'; }
      if (mE) { mE.textContent = error + '%'; mE.className = 'metric-value ' + eClass; }
      if (bE) { bE.style.width = error + '%'; bE.style.background = eClass === 'good' ? '#00cc66' : eClass === 'warn' ? '#ff8c00' : 'var(--crimson)'; }
      if (mT) { mT.textContent = throughput + '%'; mT.className = 'metric-value ' + tClass; }
      if (bTh) { bTh.style.width = throughput + '%'; bTh.style.background = '#00cc66'; }
      if (mC) { mC.textContent = cacheHit ? cacheHit.toFixed(0) + '%' : 'N/A'; }
      if (bC) { bC.style.width = cacheHit + '%'; }

      const qEl = $('m-queue');
      const cpuEl = $('m-cpu');
      if (qEl) qEl.textContent = Math.round(simState.queueDepth);
      if (cpuEl) { cpuEl.textContent = simState.cpuLoad.toFixed(0) + '%'; cpuEl.className = 'metric-value ' + cpuCls; }
    }

    /** Probabilistically fire a random operational event. */
export function maybeFireAutoEvent(apiCount) {
      const now = Date.now();
      if (trafficLevel <= 30) return;
      if (now - lastAutoEvent < AUTO_EVENT_COOLDOWN) return;
      if (Math.random() >= AUTO_EVENT_CHANCE) return;

      lastAutoEvent = now;
      const pool = [
        () => addLog('⚡ Cache eviction — miss storm starting', 'danger'),
        () => addLog('🔥 Hot key on DB — consider caching', 'warn'),
        () => addLog('📈 p99 latency spike detected', 'warn'),
        () => {
          const live = nodes.filter(n => n.type === 'api-server' && n.health > 0);
          if (!live.length) return;
          const v = live[Math.floor(Math.random() * live.length)];
          v.health = 10; v.color = '#661111';
          addLog('💀 API server under memory pressure!', 'danger');
          setTimeout(() => { v.health = 100; v.color = NODE_TYPES['api-server'].color; addLog('// server recovered', 'good'); }, 4000);
        },
      ];
      pool[Math.floor(Math.random() * pool.length)]();
    }

    /** Main tick: orchestrates sub-functions; each does one thing. */
export function sysSimTick() {
      if (!nodes.length || trafficLevel === 0) return;
      const topo = getTopology();
      stepSimState(topo);
      const metrics = deriveMetrics(topo);
      sysMetrics = { latency: metrics.latency, error: metrics.error, throughput: metrics.throughput, cache: metrics.cacheHit };
      renderSysMetrics(metrics);
      maybeFireAutoEvent(topo.apiCount);

      if (simState.queueDepth > 500) addLog(`⚠ Queue depth: ${Math.round(simState.queueDepth)} — requests backing up`, 'danger');
      if (metrics.latency > 1500 && trafficLevel > 20) addLog('⚠ Latency critical — add capacity', 'danger');
    }

    /** Trigger immediate metric update when topology changes. */
export function updateSysMetrics() { sysSimTick(); }

    // ── Canvas rendering ─────────────────────────────────────────────────────────

    /** Draw the full system canvas: grid, connections, animated packets, nodes. */
export function drawSystem() {
      if (!sysCtx) return;
      const w = sysCanvas.clientWidth, h = sysCanvas.clientHeight;
      sysCtx.clearRect(0, 0, w, h);

      // Background grid
      sysCtx.strokeStyle = 'rgba(42,21,21,0.4)';
      sysCtx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) { sysCtx.beginPath(); sysCtx.moveTo(x, 0); sysCtx.lineTo(x, h); sysCtx.stroke(); }
      for (let y = 0; y < h; y += 40) { sysCtx.beginPath(); sysCtx.moveTo(0, y); sysCtx.lineTo(w, y); sysCtx.stroke(); }

      // Connections
      connections.forEach(conn => {
        const a = conn.a, b = conn.b;
        sysCtx.beginPath();
        sysCtx.strokeStyle = trafficLevel > 0
          ? `rgba(220,20,60,${0.3 + trafficLevel * 0.004})`
          : 'rgba(139,0,0,0.35)';
        sysCtx.lineWidth = 1.5;
        sysCtx.moveTo(a.x, a.y);
        sysCtx.lineTo(b.x, b.y);
        sysCtx.stroke();

        // Animated data packets
        if (trafficLevel > 0) {
          const t = (Date.now() % 1200) / 1200;
          const px = a.x + (b.x - a.x) * t;
          const py = a.y + (b.y - a.y) * t;
          sysCtx.beginPath();
          sysCtx.fillStyle = '#C9A84C';
          sysCtx.arc(px, py, 3, 0, Math.PI * 2);
          sysCtx.fill();
        }
      });

      // Nodes
      nodes.forEach(node => {
        const alive = node.health > 50;
        const r = 28;
        const glowAmt = trafficLevel * 0.006;

        // Glow ring when traffic is active
        if (trafficLevel > 0 && alive) {
          sysCtx.beginPath();
          sysCtx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
          sysCtx.fillStyle = node.color + '22';
          sysCtx.fill();
        }

        // Node body
        sysCtx.beginPath();
        sysCtx.arc(node.x, node.y, r, 0, Math.PI * 2);
        sysCtx.fillStyle = alive ? node.color + 'cc' : '#440000';
        sysCtx.strokeStyle = alive ? node.color : '#660000';
        sysCtx.lineWidth = 2;
        sysCtx.fill();
        sysCtx.stroke();

        // Health bar (shows when degraded)
        if (node.health < 100) {
          sysCtx.fillStyle = '#220000';
          sysCtx.fillRect(node.x - r, node.y + r + 4, r * 2, 4);
          sysCtx.fillStyle = node.health > 50 ? '#ff8c00' : '#cc0000';
          sysCtx.fillRect(node.x - r, node.y + r + 4, (r * 2) * (node.health / 100), 4);
        }

        // Label
        sysCtx.fillStyle = '#fff';
        sysCtx.font = 'bold 11px Share Tech Mono';
        sysCtx.textAlign = 'center';
        sysCtx.textBaseline = 'middle';
        sysCtx.fillText(node.label, node.x, node.y);

        // Name below node
        sysCtx.fillStyle = 'rgba(200,180,160,0.75)';
        sysCtx.font = '9px Share Tech Mono';
        sysCtx.fillText(node.full, node.x, node.y + r + 16);
      });

      // Connecting-from indicator
      if (connectingFrom) {
        sysCtx.beginPath();
        sysCtx.arc(connectingFrom.x, connectingFrom.y, 34, 0, Math.PI * 2);
        sysCtx.strokeStyle = '#C9A84C';
        sysCtx.lineWidth = 2;
        sysCtx.setLineDash([4, 4]);
        sysCtx.stroke();
        sysCtx.setLineDash([]);

        if (sysMousePos) {
          sysCtx.beginPath();
          sysCtx.moveTo(connectingFrom.x, connectingFrom.y);
          sysCtx.lineTo(sysMousePos.x, sysMousePos.y);
          sysCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          sysCtx.lineWidth = 2;
          sysCtx.setLineDash([6, 6]);
          sysCtx.stroke();
          sysCtx.setLineDash([]);
        }
      }

      sysAnimFrame = requestAnimationFrame(drawSystem);
    }

export function triggerEvent(type) {
      const slider = $('traffic-slider');
      if (type === 'spike') {
        const old = parseInt(slider?.value ?? 0);
        const spiked = Math.min(100, old + 40);
        if (slider) slider.value = spiked;
        updateTraffic(spiked);
        addLog('💥 Flash sale spike! Traffic surged +40%', 'danger');
        toast('Flash Sale Spike! Handle the load!', 'warn');
        setTimeout(() => {
          if (slider) slider.value = old;
          updateTraffic(old);
          addLog('// traffic spike subsided', 'good');
        }, 8000);

      } else if (type === 'crash') {
        const apis = nodes.filter(n => n.type === 'api-server');
        if (!apis.length) { toast('No API servers to crash!', 'warn'); return; }
        const victim = apis[Math.floor(Math.random() * apis.length)];
        victim.health = 0; victim.color = '#440000';
        const msg = apis.length > 1 ? 'Others absorbing load' : 'SYSTEM DOWN';
        addLog(`💀 API Server crashed! ${msg}`, 'danger');
        toast(apis.length > 1 ? 'Worker crashed — others absorbing!' : 'System down!', 'warn');
        setTimeout(() => { victim.health = 100; victim.color = NODE_TYPES['api-server'].color; addLog('// worker auto-restarted', 'good'); }, 5000);

      } else if (type === 'cache-miss') {
        addLog('⚡ Cache miss storm! All reads hitting DB', 'danger');
        toast('Cache miss storm!', 'warn');
        const mLat = $('m-latency');
        if (mLat) { mLat.textContent = (sysMetrics.latency * 3) + 'ms'; mLat.className = 'metric-value danger'; }
        setTimeout(() => sysSimTick(), 6000);
      }
    }

export function addLog(msg, type = '') {
      eventLog.unshift({ msg, type });
      if (eventLog.length > 20) eventLog.pop();
      const el = $('event-log');
      if (el) el.innerHTML = eventLog.slice(0, 10)
        .map(e => `<div class="log-entry ${e.type}">${e.msg}</div>`).join('');
    }

    // ═══════════════════════════════════════
