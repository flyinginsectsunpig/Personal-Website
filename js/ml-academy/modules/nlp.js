import { $ } from '../core/utils.js';
import { addXP } from '../core/state.js';

export function nlp(stage) {
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
}
