import {$,  DOM, setText, setMetricDisplay, callGemini } from '../config/dom.js';
import { toast } from '../ui/toast.js';
import { GEMINI_TEMP_BOSS } from '../config/constants.js';

    // DATABASE DUNGEON — DYNAMIC GEMINI BOSSES
    // ═══════════════════════════════════════
    // Seed topics rotate so every session is different
export const DB_BOSS_TOPICS = [
      { concept: 'INDEXING', ms: 1200, theme: 'missing index on a high-cardinality WHERE clause' },
      { concept: 'N+1 FIX', ms: 3400, theme: 'N+1 query problem loading related records in a loop' },
      { concept: 'NORMALIZATION', ms: 47000, theme: 'cartesian product explosion from missing JOIN condition' },
      { concept: 'SHARDING', ms: 800, theme: 'single-node write bottleneck under high write load' },
      { concept: 'READ REPLICA', ms: 650, theme: 'heavy analytics reads saturating the primary write database' },
      { concept: 'CACHING', ms: 950, theme: 'repeated identical queries hammering the database with no cache layer' },
    ]; let dbLevel = 0, dbScore = 0, dbAnswered = false;
export let unlockedConcepts = [];
export let currentDBBoss = null;
export let sessionTopics = [...DB_BOSS_TOPICS].sort(() => Math.random() - 0.5).slice(0, 5);
export let dbLoadingInterval;

export function initDBRealm() {
      dbLevel = 0; dbScore = 0; dbAnswered = false; unlockedConcepts = [];
      sessionTopics = [...DB_BOSS_TOPICS].sort(() => Math.random() - 0.5).slice(0, 5);
      currentDBBoss = null;
      generateDBBoss();
    }

function extractFirstJSONObject(raw) {
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) return raw.trim();
      return raw.slice(start, end + 1).trim();
    }

function parseBossJSON(raw) {
      const normalized = raw.replace(/```json|```/gi, '').trim();
      const candidates = [
        normalized,
        extractFirstJSONObject(normalized),
        extractFirstJSONObject(normalized).replace(/,\s*([}\]])/g, '$1'),
      ];

      let lastError = null;
      for (const candidate of candidates) {
        try {
          return JSON.parse(candidate);
        } catch (e) {
          lastError = e;
        }
      }
      throw lastError || new Error('Unable to parse boss JSON');
    }

function isBossShapeValid(boss) {
      return !!(
        boss &&
        typeof boss.bossName === 'string' &&
        typeof boss.query === 'string' &&
        typeof boss.stat === 'string' &&
        Array.isArray(boss.solutions) &&
        boss.solutions.length >= 4
      );
    }

    async function generateDBBoss() {
      const topic = sessionTopics[dbLevel];

      setText(DOM.bossName, '// GENERATING BOSS...');
      setText(DOM.dbFeedback, '// stand by');
      setText(DOM.dbLevel, `LEVEL ${dbLevel + 1} OF ${sessionTopics.length}`);
      DOM.solutionGrid.innerHTML = `<div style="font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:var(--blood);padding:1rem;grid-column:span 2">// summoning boss from the void...</div>`;

      clearInterval(dbLoadingInterval);
      let dotCount = 0;
      const loadingFrames = ['[=   ]', '[ =  ]', '[  = ]', '[   =]', '[  = ]', '[ =  ]'];
      dbLoadingInterval = setInterval(() => {
        dotCount++;
        const frame = loadingFrames[dotCount % loadingFrames.length];
        setText(DOM.queryDisplay, `// Gemini is crafting scenario ${frame} ${'.'.repeat(1 + (dotCount % 3))}`);
      }, 250);

      const prompt = `You are generating a database query boss fight for a gamified developer portfolio.

Topic: ${topic.theme}
Concept to teach: ${topic.concept}
Base query time: ${topic.ms}ms

Return ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "bossName": "THE [DRAMATIC ALL-CAPS NAME]",
  "query": "the SQL query showing the problem (4-8 lines with comments showing row counts and timing)",
  "stat": "⚠ one-line description of the problem",
  "solutions": [
    { "label": "🔧 Short Action", "sub": "technical detail", "correct": true, "feedback": "✅ explanation with specific performance improvement" },
    { "label": "🔧 Short Action", "sub": "technical detail", "correct": false, "feedback": "❌ why this misses the root cause" },
    { "label": "🔧 Short Action", "sub": "technical detail", "correct": false, "feedback": "❌ why this misses the root cause" },
    { "label": "🔧 Short Action", "sub": "technical detail", "correct": false, "feedback": "❌ explanation" }
  ]
}

Use real SQL. The correct solution must directly address the ${topic.concept} concept. Use emojis like 🗂 🔗 📋 ⚡ 🧩 📊 for labels.`;

      try {
        const text = await callGemini(prompt, GEMINI_TEMP_BOSS, 1400);
        clearInterval(dbLoadingInterval);
        let boss;
        try {
          boss = parseBossJSON(text);
        } catch (parseErr) {
          const repairPrompt = `Fix the following into valid JSON only. Do not add markdown. Keep the same structure and content:\n${text}`;
          const repaired = await callGemini(repairPrompt, 0.1, 1400);
          boss = parseBossJSON(repaired);
        }
        if (!isBossShapeValid(boss)) throw new Error('Invalid boss shape from model');
        boss.ms = topic.ms;
        boss.concept = topic.concept;
        currentDBBoss = boss;
        renderDBBoss(boss);
      } catch (e) {
        clearInterval(dbLoadingInterval);
        console.warn('generateDBBoss fallback:', e.message);
        currentDBBoss = getFallbackBoss(topic);
        renderDBBoss(currentDBBoss);
      }
    }

    /** Complete offline fallbacks — one per concept so no concept ever repeats. */
export function getFallbackBoss(topic) {
      const FALLBACKS = {
        'INDEXING': {
          bossName: 'THE FULL TABLE SCAN',
          query: `SELECT * FROM users WHERE email = 'x@test.com';\n\n-- 847,293 rows scanned\n-- No index found\n-- Query time: 1200ms`,
          stat: '⚠ Sequential scan on 847K-row table — O(n) on every lookup',
          solutions: [
            { label: '🗂 Add Index', sub: 'CREATE INDEX ON users(email)', correct: true, feedback: '✅ B-tree index cuts lookup from O(n) to O(log n). 1200ms → 2ms.' },
            { label: '📦 Add Cache', sub: 'Redis/Memcached layer', correct: false, feedback: '❌ Cold cache still hits the slow query. Index first.' },
            { label: '📐 Normalize', sub: 'Split the users table', correct: false, feedback: '❌ Normalization reduces redundancy but doesn\'t replace a missing index.' },
            { label: '📋 Read Replica', sub: 'Offload to replica', correct: false, feedback: '❌ Same slow query runs on the replica too.' },
          ],
        },
        'N+1 FIX': {
          bossName: 'THE N+1 HYDRA',
          query: `-- Fetching 100 orders, then for each:\nSELECT * FROM order_items WHERE order_id = ?;\n\n-- 1 + 100 = 101 queries fired\n-- Total time: 3400ms`,
          stat: '⚠ N+1 pattern: one query per record in a loop',
          solutions: [
            { label: '🔗 JOIN Query', sub: 'SELECT o.*, i.* FROM orders o JOIN order_items i', correct: true, feedback: '✅ One JOIN replaces 101 queries. 3400ms → ~45ms.' },
            { label: '🔥 Eager Load', sub: 'Batch-fetch associations', correct: true, feedback: '✅ Eager loading issues 2 batched queries instead of 101.' },
            { label: '🗂 Add Index', sub: 'Index order_id on items', correct: false, feedback: '⚠ Speeds each query but 101 round-trips remain — N+1 is still there.' },
            { label: '🧩 Denormalize', sub: 'Store item count on order', correct: false, feedback: '❌ Works only for counts. Full item data still requires fetching.' },
          ],
        },
        'NORMALIZATION': {
          bossName: 'THE CARTESIAN EXPLOSION',
          query: `SELECT * FROM orders o\nJOIN products p ON p.id > 0\nJOIN categories c ON c.id > 0;\n\n-- Missing proper ON condition!\n-- 50K × 10K × 200 = 100B rows\n-- Query time: 47,000ms`,
          stat: '⚠ Implicit cartesian product — rows multiplied across all tables',
          solutions: [
            { label: '🔗 Fix JOIN', sub: 'Add proper ON p.id = o.product_id', correct: true, feedback: '✅ Correct join condition eliminates the cartesian product. ~80ms.' },
            { label: '⚡ Add Cache', sub: 'Cache the result set', correct: false, feedback: '❌ Caching a 47s query doesn\'t fix it — the explosion must be prevented.' },
            { label: '🗂 Add Indexes', sub: 'Index all foreign keys', correct: false, feedback: '⚠ Important, but indexes can\'t fix a missing JOIN condition.' },
            { label: '🧊 Pagination', sub: 'LIMIT the output', correct: false, feedback: '⚠ LIMIT reduces rows returned but the cartesian is still computed in full.' },
          ],
        },
        'SHARDING': {
          bossName: 'THE WRITE BOTTLENECK',
          query: `INSERT INTO events (user_id, payload, ts)\nVALUES (?, ?, NOW());\n\n-- 50,000 writes/sec to one node\n-- Write queue depth: 8,000\n-- Avg write latency: 800ms`,
          stat: '⚠ Single-node write bottleneck — queue growing unbounded',
          solutions: [
            { label: '🗄 Shard by key', sub: 'Hash user_id across N nodes', correct: true, feedback: '✅ Sharding spreads writes across nodes — throughput scales linearly.' },
            { label: '📬 Write Queue', sub: 'Buffer with async queue', correct: true, feedback: '✅ Buffering + batch inserts absorbs spikes and reduces DB pressure.' },
            { label: '🗂 Add Index', sub: 'Index the ts column', correct: false, feedback: '❌ More indexes slow writes further — each INSERT must update every index.' },
            { label: '📋 Read Replica', sub: 'Add replica', correct: false, feedback: '❌ Replicas help reads. This is a write throughput problem.' },
          ],
        },
        'READ REPLICA': {
          bossName: 'THE ANALYTICS CRUSHER',
          query: `-- 200 concurrent dashboard users running:\nSELECT user_id, COUNT(*), AVG(total)\nFROM orders\nGROUP BY user_id;\n\n-- Primary DB CPU: 94%\n-- Avg latency: 650ms`,
          stat: '⚠ Heavy analytics reads saturating write-DB CPU',
          solutions: [
            { label: '📋 Read Replica', sub: 'Route analytics to replica', correct: true, feedback: '✅ Offloading reads drops primary CPU from 94% to ~15%.' },
            { label: '📊 Materialized', sub: 'Pre-aggregate into a view', correct: true, feedback: '✅ Pre-computing aggregates means the GROUP BY runs once — reads become instant.' },
            { label: '🔗 Tune Query', sub: 'Rewrite the SQL', correct: false, feedback: '⚠ Helps marginally but 200 concurrent users still swamp one DB node.' },
            { label: '🗂 Add Index', sub: 'Index user_id + total', correct: false, feedback: '⚠ Helps scans but GROUP BY on 50M rows with one DB still crushes CPU.' },
          ],
        },
        'CACHING': {
          bossName: 'THE STAMPEDE',
          query: `-- 500 req/s all hitting:\nSELECT * FROM product_catalog\nWHERE category = 'electronics';\n\n-- Same query, no cache\n-- DB CPU: 88%\n-- Query time: 950ms`,
          stat: '⚠ Identical queries hammering DB — no cache layer',
          solutions: [
            { label: '⚡ Add Redis', sub: 'Cache result with TTL', correct: true, feedback: '✅ Cache-aside with Redis serves 500 req/s from memory. DB load drops 95%.' },
            { label: '🗂 Add Index', sub: 'Index category column', correct: false, feedback: '⚠ Speeds each query but 500 identical queries/s still all hit the DB.' },
            { label: '📋 Read Replica', sub: 'Add replica', correct: false, feedback: '⚠ Distributes load but identical uncached queries still hammer both nodes.' },
            { label: '🧩 Denormalize', sub: 'Store category in each row', correct: false, feedback: '❌ Already denormalized. The problem is repeated identical reads, not schema.' },
          ],
        },
      };

      const boss = FALLBACKS[topic.concept] ?? FALLBACKS['INDEXING'];
      return { ...boss, ms: topic.ms, concept: topic.concept };
    }

export function renderDBBoss(boss) {
      dbAnswered = false;
      setText(DOM.bossName, boss.bossName);
      setText(DOM.bossMs, boss.ms + 'ms');
      setText($('boss-hp-text'), boss.ms + 'ms');
      setText(DOM.queryDisplay, boss.query);
      setText($('query-stat'), boss.stat);
      setText(DOM.dbFeedback, '// choose a solution to defeat the boss');
      DOM.bossHp.style.width = '100%';

      const shuffled = [...boss.solutions].sort(() => Math.random() - 0.5);
      DOM.solutionGrid.innerHTML = shuffled.map((s, i) => `
    <button class="solution-btn" onclick="attemptSolution(${i})">
      <span class="btn-icon">${s.label.split(' ')[0]}</span>
      ${s.label.slice(s.label.indexOf(' ') + 1)}
      <span class="btn-label">${s.sub}</span>
    </button>
  `).join('');
      DOM.solutionGrid._shuffled = shuffled;
    }

    /** Alias kept for backwards-compat (called from HTML onclick) */
export function renderDBLevel() { generateDBBoss(); }

export function attemptSolution(idx) {
      if (dbAnswered) return;
      if (!currentDBBoss) return;

      const grid = DOM.solutionGrid;
      const sol = grid._shuffled[idx];
      const btns = grid.querySelectorAll('.solution-btn');
      btns[idx].classList.add(sol.correct ? 'correct' : 'wrong');

      setText(DOM.dbFeedback, sol.feedback);

      if (sol.correct) {
        dbAnswered = true;
        const newMs = Math.round(currentDBBoss.ms * 0.03);
        DOM.bossHp.style.width = '0%';
        setText(DOM.bossMs, newMs + 'ms');
        setText($('boss-hp-text'), newMs + 'ms');

        const pts = Math.round((currentDBBoss.ms / 100) * 10);
        dbScore += pts;
        setText(DOM.dbScore, String(dbScore));

        if (!unlockedConcepts.includes(currentDBBoss.concept)) {
          unlockedConcepts.push(currentDBBoss.concept);
          updateKnowledgeTags();
        }
        toast(`⚔ Boss Defeated! +${pts} pts`, 'success');

        setTimeout(() => {
          if (dbLevel < sessionTopics.length - 1) {
            dbLevel++;
            generateDBBoss();
          } else {
            setText(DOM.dbFeedback, '🏆 ALL BOSSES DEFEATED. Database Dungeon complete!');
            toast('🏆 Database Dungeon Cleared!', 'success');
          }
        }, 2500);
      } else {
        toast('Wrong approach — try again', 'warn');
      }
    }

export function updateKnowledgeTags() {
      const tagEls = document.querySelectorAll('#knowledge-tags .knowledge-tag');
      const concepts = ['INDEXING', 'CACHING', 'NORMALIZATION', 'READ REPLICA', 'N+1 FIX', 'SHARDING'];
      tagEls.forEach((tag, i) => {
        tag.style.opacity = unlockedConcepts.includes(concepts[i]) ? '1' : '0.3';
        if (unlockedConcepts.includes(concepts[i])) tag.style.borderColor = '#00cc66';
      });
    }

    // ═══════════════════════════════════════

    // Legacy in-page ML lab removed; dedicated ML experience now lives in ml-academy.html

export function seededRng(seed) {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
    }

    // ═══════════════════════════════════════
