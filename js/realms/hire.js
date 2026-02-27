import {$,  DOM, callGemini } from '../config/dom.js';

    // WHY HIRE ME PAGE
    // ═══════════════════════════════════════
export const HIRE_MODES = {
      automation: {
        tag: 'AUTOMATION & AI LENS',
        headline: 'I automate the tedious<br>and accelerate the complex.',
        subline: `I blend backend systems thinking with <strong>enterprise RPA, Azure DevOps, and AI-assisted tooling</strong>. I build intelligent workflows that save hours of human effort.`,
        cards: [
          { icon: '🤖', title: 'AI & Copilot Agents', body: 'Accelerated development and automated complex tasks using Copilot agents, Stubber, and LLM API integrations.', proof: '→ Integrated Gemini API here', action: "toggleChat()" },
          { icon: '⚙', title: 'Enterprise RPA & Blue Prism', body: 'Translated business requirements into technical SDDs and built robust RPA solutions handling enterprise logic.', proof: '→ COGENT Automation Team' },
          { icon: '🚀', title: 'Azure DevOps & CI/CD', body: 'Collaborated in Agile teams using Azure DevOps, managing version control, CI/CD pipelines, and C# ABP Framework backend tasks.', proof: '→ COGENT DevOps Team' },
          { icon: '🧠', title: 'Machine Learning', body: 'Trained in regression, classification trees, SVMs, and neural networks. I know how to preprocess data and evaluate models correctly.', proof: '→ ML Lab (Regression/Classification)', action: "enterRealm('ml')" },
          { icon: '📋', title: 'Systems Planning & PDDs', body: 'Gathered client requirements, mapped business processes, and wrote detailed Process Definition Documents (PDDs) before writing a single line of code.', proof: '→ COGENT Analyst Team' },
          { icon: '🔗', title: 'Full-Stack Integration', body: 'Seamlessly connect automated bots and AI models directly into scalable React/TypeScript and Java/C# backends.', proof: '→ Full-Stack Project Experience', action: "enterRealm('projects')" },
        ],
        evidence: [
          { title: 'Enterprise Automation Lifecycle', body: 'Handled end-to-end automation from PDD gathering to SDD architecture to Blue Prism implementation' },
          { title: 'AI-Powered Job Matching', body: 'Developed an AI tool that matched job requirements with candidate profiles using NLP' },
          { title: 'League Patch Note Scraper', body: 'Built a Python script to scrape and parse complex patch note data into a consumable format' },
          { title: '3D E-Commerce Platform', body: 'Built PrintIt101 utilizing Three.js and Spring Boot, showcasing complex full-stack architecture' },
        ]
      },

      backend: {
        tag: 'BACKEND ENGINEER LENS',
        headline: 'I build APIs and systems<br>that don\'t break under pressure.',
        subline: `Give me a complex backend problem — a slow query, a traffic spike, a race condition — and I\'ll <strong>diagnose it, architect a fix, and ship it</strong>. That\'s the kind of engineer this arcade proves I am.`,
        cards: [
          { icon: '⚖', title: 'Load Balancing & Scaling', body: 'Designed round-robin load balancers in Java. Understand horizontal vs vertical scaling tradeoffs, sticky sessions, and connection draining.', proof: '→ Playable in System Realm', action: "enterRealm('system')" },
          { icon: '🗄', title: 'Database Optimisation', body: 'Indexing strategies, N+1 elimination, query plan analysis, read replicas, sharding patterns. Can turn a 1200ms query into 2ms.', proof: '→ 5 boss fights in DB Dungeon', action: "enterRealm('database')" },
          { icon: '📬', title: 'Async Architecture', body: 'Message queues, async workers, backpressure handling. Understands when to decouple writes from reads and why.', proof: '→ Queue node in System Realm', action: "enterRealm('system')" },
          { icon: '🔐', title: 'Production Thinking', body: 'CI/CD pipelines, canary deploys, rollback strategies, monitoring. Doesn\'t treat "works on my machine" as a finish line.', proof: '→ DevOps Arena pipeline builder', action: "enterRealm('devops')" },
          { icon: '☕', title: 'Java', body: 'OOP, collections, concurrency, JDBC, HTTP servers. Wrote the LoadBalancer and ConnectionPool from scratch.', proof: '→ View Code in System Realm', action: "enterRealm('system')" },
          { icon: '🐍', title: 'Python', body: 'Flask/FastAPI patterns, psycopg2, Redis integration, benchmarking scripts. Comfortable with both scripting and backend service work.', proof: '→ View Code in DB Dungeon', action: "enterRealm('database')" },
        ],
        evidence: [
          { title: 'Diagnosed query bottlenecks', body: 'Benchmarked before/after index creation: 1200ms → 2ms on 847K row table' },
          { title: 'Built connection pooling', body: 'Java ConnectionPool with blocking queue, acquire/release lifecycle, configurable pool size' },
          { title: 'Implemented caching patterns', body: 'Cache-aside in Python with Redis, TTL management, decorator pattern for clean DX' },
          { title: 'Wrote CI/CD pipelines', body: 'Bash pipeline with lint → test → build → canary → prod with auto-rollback on error rate' },
        ]
      },
      fullstack: {
        tag: 'FULL STACK ENGINEER LENS',
        headline: 'I build the whole thing —<br>from database query to what you see on screen.',
        subline: `I don\'t hand off at the API boundary. I own the data model, the service layer, and the interface. <strong>Systems thinking applied end-to-end</strong> — that\'s the differentiator.`,
        cards: [
          { icon: '🎨', title: 'Canvas & Creative UI', body: 'Built a full RPG engine on the HTML5 Canvas API from scratch. Character movement, collision detection, interactive zone triggers, achievement systems.', proof: '→ The site you\'re on right now', action: "backToCards()" },
          { icon: '⚡', title: 'Vanilla JS & DOM Mastery', body: 'No framework crutches. Custom animation loops, drag-and-drop, real-time metric rendering, CSS variable theming — all hand-rolled.', proof: '→ All 6 realms in this arcade', action: "backToCards()" },
          { icon: '⚙', title: 'Backend Architecture', body: 'REST APIs, database design, caching, async processing. Can design a system end-to-end and reason about where each piece lives.', proof: '→ System Realm + DB Dungeon', action: "enterRealm('system')" },
          { icon: '🤖', title: 'AI Integration', body: 'Integrated Gemini API with context-aware prompting, mode switching, and live realm state injection. The Oracle chatbot adapts to where you are.', proof: '→ Press 🔮 bottom-right', action: "toggleChat()" },
          { icon: '📐', title: 'System Design Thinking', body: 'Approaches every feature asking: how does this scale, where does it break, what\'s the bottleneck? That thinking shows in every realm here.', proof: '→ Entire arcade architecture', action: "backToCards()" },
          { icon: '🚀', title: 'Deployment & DevOps', body: 'Docker, bash pipelines, canary deployments. Ships code that\'s production-aware from day one.', proof: '→ DevOps Arena', action: "enterRealm('devops')" },
        ],
        evidence: [
          { title: 'Built end-to-end interactive system', body: 'Canvas engine + simulation logic + real-time metrics + AI chatbot — all in one cohesive product' },
          { title: 'State management without a framework', body: 'All realm state, drawer logic, and UI transitions built with vanilla JS and clean separation' },
          { title: 'Context-aware AI integration', body: 'Gemini chatbot knows which realm you\'re in and adjusts its persona (Explain / Interview / Advisor)' },
          { title: 'Pixel-perfect dark system UI', body: 'Custom CSS variables, animated particles, warp tunnel transition, scanline effects, custom cursor' },
        ]
      },
      ml: {
        tag: 'ML ENGINEER LENS',
        headline: 'I understand the math,<br>the pipeline, and what actually ships.',
        subline: `ML work that never leaves a Jupyter notebook is a hobby. I build <strong>pipelines that run in production</strong>, understand tradeoffs between models, and can explain every decision in an interview.`,
        cards: [
          { icon: '📈', title: 'Supervised Learning', body: 'Linear/polynomial regression, SVM, decision trees, random forests, KNN. Understands bias-variance tradeoff from first principles — not just definitions.', proof: '→ Regression + Classification Arena', action: "enterRealm('ml')" },
          { icon: '🔵', title: 'Unsupervised Learning', body: 'K-Means, hierarchical clustering, DBSCAN. Knows when K is too high, how silhouette scores work, and what over-segmentation looks like.', proof: '→ Clustering Zone in ML Lab', action: "enterRealm('ml')" },
          { icon: '🎰', title: 'Reinforcement Learning', body: 'Multi-armed bandit problem, UCB1, Thompson Sampling. Understands exploration-exploitation tradeoff and Bayesian posterior sampling.', proof: '→ RL Arena — rare in junior portfolios', action: "enterRealm('ml')" },
          { icon: '🧬', title: 'Neural Networks', body: 'Architecture tuning, batch normalisation, dropout regularisation, CNN advantages for vision. Knows why deeper ≠ better without regularisation.', proof: '→ Neural Net Lab in ML Lab', action: "enterRealm('ml')" },
          { icon: '🔧', title: 'sklearn Pipelines', body: 'End-to-end pipelines: imputation → scaling → model → GridSearchCV. Wrote cross-validation model comparison from scratch.', proof: '→ View Code in ML Lab', action: "enterRealm('ml')" },
          { icon: '📊', title: 'Evaluation & Analysis', body: 'F1, precision/recall, confusion matrices, R², silhouette scores, RMSE. Doesn\'t just report accuracy — reports the right metric for the problem.', proof: '→ Model Stats panel in ML Lab', action: "enterRealm('ml')" },
        ],
        evidence: [
          { title: 'Demonstrated overfitting live', body: 'Polynomial d=8: train R² 0.99 vs test R² 0.61 — bias-variance tradeoff made visible and interactive' },
          { title: 'Implemented RL from scratch', body: 'Thompson Sampling and UCB1 in Python — rare at junior level, proven in the RL Arena' },
          { title: 'Full sklearn pipeline with GridSearchCV', body: 'Preprocessing → model → hyperparameter tuning → cross-validation, all in production-ready pipeline code' },
          { title: 'ML knowledge is playable', body: 'Every algorithm in the ML Lab has real accuracy numbers, real insights, and real code behind the "Run" button' },
        ]
      }
    };

export let hireMode = 'backend';

export function setHireMode(mode) {
      hireMode = mode;
      document.querySelectorAll('.hire-toggle').forEach(b => b.classList.remove('active'));
      $('toggle-' + mode)?.classList.add('active');
      renderHireContent();
    }

export function renderHireContent() {
      const m = HIRE_MODES[hireMode];
      const cardsHtml = m.cards.map(c => `
    <div class="hire-card">
      <div class="hire-card-icon">${c.icon}</div>
      <div class="hire-card-title">${c.title}</div>
      <div class="hire-card-body">
        ${c.body}
        <span class="proof" ${c.action ? `onclick="${c.action}" style="cursor:pointer;text-decoration:underline;color:var(--crimson);transition:opacity 0.2s" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'"` : ''}>${c.proof}</span>
      </div>
    </div>
  `).join('');

      const evidenceHtml = m.evidence.map(e => `
    <div class="evidence-item">
      <span class="evidence-check">✓</span>
      <div class="evidence-text">
        <strong>${e.title}</strong>
        ${e.body}
      </div>
    </div>
  `).join('');

      $('hire-content').innerHTML = `
    <div style="margin-bottom:2rem">
      <div class="hire-mode-tag">${m.tag}</div>
      <div class="hire-headline">${m.headline}</div>
      <div class="hire-subline">${m.subline}</div>
    </div>

    <div style="font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.2em;color:var(--crimson);margin-bottom:1rem">WHAT I BRING</div>
    <div class="hire-grid">${cardsHtml}</div>

    <div style="font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.2em;color:var(--crimson);margin-bottom:1rem">PROOF POINTS</div>
    <div class="hire-evidence">${evidenceHtml}</div>

    <div class="hire-cta">
      <a href="mailto:zakhirmckinnon2016@gmail.com" class="hire-cta-btn">✉ GET IN TOUCH</a>
      <a href="https://www.linkedin.com/in/zakhir-mckinnon-ba20ab300" target="_blank" class="hire-cta-btn">💼 LINKEDIN</a>
      <a href="https://github.com/flyinginsectsunpig" target="_blank" class="hire-cta-btn">⌥ GITHUB</a>
      <span class="hire-cta-note">// Available for full-time roles · Open to remote</span>
    </div>
  `;
    }

export function initHireRealm() {
      hireMode = 'backend';
      document.querySelectorAll('.hire-toggle').forEach(b => b.classList.remove('active'));
      $('toggle-backend')?.classList.add('active');
      renderHireContent();
    }

export const CODE_SNIPPETS = {
      system: [
        {
          tab: 'LoadBalancer.java',
          lang: 'java',
          title: 'Load Balancer (Java)',
          desc: 'Round-robin load balancer implemented in Java. Distributes requests across a pool of backend servers, tracking health and connection counts.',
          stack: ['java'],
          code: `<span class="cm">// LoadBalancer.java — Round-Robin implementation</span>
<span class="kw">import</span> java.util.*;
<span class="kw">import</span> java.util.concurrent.atomic.AtomicInteger;

<span class="kw">public class</span> <span class="cls">LoadBalancer</span> {
    <span class="kw">private final</span> List&lt;<span class="cls">ServerNode</span>&gt; nodes;
    <span class="kw">private final</span> AtomicInteger counter = <span class="kw">new</span> AtomicInteger(<span class="num">0</span>);

    <span class="kw">public</span> <span class="fn">LoadBalancer</span>(List&lt;<span class="cls">ServerNode</span>&gt; nodes) {
        this.nodes = nodes;
    }

    <span class="kw">public</span> <span class="cls">ServerNode</span> <span class="fn">getNext</span>() {
        List&lt;<span class="cls">ServerNode</span>&gt; healthy = nodes.stream()
            .filter(<span class="cls">ServerNode</span>::isHealthy)
            .toList();
        <span class="kw">if</span> (healthy.isEmpty()) <span class="kw">throw new</span> <span class="cls">RuntimeException</span>(<span class="str">"No healthy nodes"</span>);
        <span class="kw">int</span> idx = counter.getAndIncrement() % healthy.size();
        <span class="kw">return</span> healthy.get(idx);
    }

    <span class="kw">public void</span> <span class="fn">routeRequest</span>(<span class="cls">HttpRequest</span> req) {
        <span class="cls">ServerNode</span> target = <span class="fn">getNext</span>();
        target.<span class="fn">handle</span>(req);
    }
}`
        },
        {
          tab: 'cache_layer.py',
          lang: 'python',
          title: 'Redis Cache Layer (Python)',
          desc: 'Python cache-aside pattern implementation using Redis. Checks cache before DB, handles TTL and cache invalidation.',
          stack: ['python'],
          code: `<span class="cm"># cache_layer.py — Cache-aside pattern with Redis</span>
<span class="kw">import</span> redis
<span class="kw">import</span> json
<span class="kw">from</span> functools <span class="kw">import</span> wraps

r = redis.<span class="cls">Redis</span>(host=<span class="str">'localhost'</span>, port=<span class="num">6379</span>)

<span class="kw">def</span> <span class="fn">cached</span>(ttl=<span class="num">300</span>):
    <span class="kw">def</span> <span class="fn">decorator</span>(func):
        <span class="dec">@wraps</span>(func)
        <span class="kw">def</span> <span class="fn">wrapper</span>(*args, **kwargs):
            key = <span class="str">f"cache:{func.__name__}:{args}:{kwargs}"</span>
            cached_val = r.<span class="fn">get</span>(key)
            <span class="kw">if</span> cached_val:
                <span class="kw">return</span> json.<span class="fn">loads</span>(cached_val)
            result = <span class="fn">func</span>(*args, **kwargs)
            r.<span class="fn">setex</span>(key, ttl, json.<span class="fn">dumps</span>(result))
            <span class="kw">return</span> result
        <span class="kw">return</span> wrapper
    <span class="kw">return</span> decorator

<span class="dec">@cached</span>(ttl=<span class="num">60</span>)
<span class="kw">def</span> <span class="fn">get_user</span>(user_id: int) -> dict:
    <span class="cm"># Without cache: ~200ms DB query</span>
    <span class="cm"># With cache:    ~2ms Redis lookup</span>
    <span class="kw">return</span> db.<span class="fn">query</span>(<span class="str">f"SELECT * FROM users WHERE id = {user_id}"</span>)`
        }
      ],
      database: [
        {
          tab: 'indexing.sql',
          lang: 'sql',
          title: 'Index Optimization (SQL)',
          desc: 'Real PostgreSQL index strategies used in the DB Dungeon bosses. Shows B-tree, composite, and partial indexes with EXPLAIN output.',
          stack: ['sql'],
          code: `<span class="cm">-- indexing.sql — Index strategies demonstrated in DB Dungeon</span>

<span class="cm">-- BOSS 1: Full table scan — 1200ms without index</span>
<span class="kw">EXPLAIN ANALYZE</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> users <span class="kw">WHERE</span> email = <span class="str">'user@test.com'</span>;
<span class="cm">-- Seq Scan on users  (cost=0.00..18450.00 rows=1)
--   Execution Time: 1204.321 ms</span>

<span class="cm">-- FIX: Create B-tree index</span>
<span class="kw">CREATE INDEX CONCURRENTLY</span> idx_users_email
    <span class="kw">ON</span> users(email);

<span class="cm">-- After index: 2ms</span>
<span class="cm">-- Index Scan using idx_users_email
--   Execution Time: 2.041 ms  ✅</span>

<span class="cm">-- BOSS 3: Cartesian explosion fix</span>
<span class="cm">-- BAD: Missing join condition</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> orders o
<span class="kw">JOIN</span> order_items oi <span class="kw">ON</span> o.id = oi.order_id  <span class="cm">-- ✅ this was missing</span>
<span class="kw">JOIN</span> products p    <span class="kw">ON</span> oi.product_id = p.id;

<span class="cm">-- BOSS 5: Composite index for analytics</span>
<span class="kw">CREATE INDEX</span> idx_orders_analytics
    <span class="kw">ON</span> orders(user_id, created_at <span class="kw">DESC</span>)
    <span class="kw">WHERE</span> status = <span class="str">'completed'</span>;  <span class="cm">-- partial index</span>`
        },
        {
          tab: 'QueryOptimizer.java',
          lang: 'java',
          title: 'Query Optimizer (Java)',
          desc: 'Java implementation of N+1 query detection and batch loading using JDBC. Shows how ORMs fix N+1 at the framework level.',
          stack: ['java', 'sql'],
          code: `<span class="cm">// QueryOptimizer.java — Fix N+1 with batched queries</span>
<span class="kw">public class</span> <span class="cls">UserOrderRepository</span> {

    <span class="cm">// ❌ BAD: N+1 problem — 101 queries for 100 users</span>
    <span class="kw">public</span> List&lt;<span class="cls">UserWithOrders</span>&gt; <span class="fn">loadNaive</span>() {
        List&lt;<span class="cls">User</span>&gt; users = <span class="fn">executeQuery</span>(<span class="str">"SELECT * FROM users"</span>);
        <span class="kw">for</span> (<span class="cls">User</span> u : users) {
            u.orders = <span class="fn">executeQuery</span>(
                <span class="str">"SELECT * FROM orders WHERE user_id = "</span> + u.id
            ); <span class="cm">// 100 extra queries!</span>
        }
        <span class="kw">return</span> users;
    }

    <span class="cm">// ✅ GOOD: Single JOIN — 1 query</span>
    <span class="kw">public</span> List&lt;<span class="cls">UserWithOrders</span>&gt; <span class="fn">loadOptimized</span>() {
        <span class="cls">String</span> sql = <span class="str">"""
            SELECT u.id, u.name, o.id AS order_id, o.total
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            ORDER BY u.id
        """</span>;
        <span class="kw">return</span> <span class="fn">executeQuery</span>(sql);
    }
}`
        },
        {
          tab: 'db_bench.py',
          lang: 'python',
          title: 'DB Benchmarking (Python)',
          desc: 'Python script to benchmark query performance before and after optimizations. Uses psycopg2 and timing utilities.',
          stack: ['python', 'sql'],
          code: `<span class="cm"># db_bench.py — Query performance benchmarking</span>
<span class="kw">import</span> psycopg2, time, statistics

<span class="kw">def</span> <span class="fn">benchmark</span>(query: str, runs: int = <span class="num">50</span>) -> dict:
    conn = psycopg2.<span class="fn">connect</span>(<span class="str">"dbname=testdb user=postgres"</span>)
    cur = conn.<span class="fn">cursor</span>()
    times = []
    <span class="kw">for</span> _ <span class="kw">in range</span>(runs):
        start = time.<span class="fn">perf_counter</span>()
        cur.<span class="fn">execute</span>(query)
        cur.<span class="fn">fetchall</span>()
        times.<span class="fn">append</span>((time.<span class="fn">perf_counter</span>() - start) * <span class="num">1000</span>)
    <span class="kw">return</span> {
        <span class="str">'mean_ms'</span>: statistics.<span class="fn">mean</span>(times),
        <span class="str">'p95_ms'</span>:  sorted(times)[<span class="kw">int</span>(runs * <span class="num">0.95</span>)],
        <span class="str">'min_ms'</span>:  <span class="fn">min</span>(times)
    }

before = <span class="fn">benchmark</span>(<span class="str">"SELECT * FROM users WHERE email='a@b.com'"</span>)
<span class="cm"># {'mean_ms': 1204.3, 'p95_ms': 1350.1, 'min_ms': 1180.2}</span>
<span class="cm"># → CREATE INDEX idx_users_email ON users(email);</span>
after = <span class="fn">benchmark</span>(<span class="str">"SELECT * FROM users WHERE email='a@b.com'"</span>)
<span class="cm"># {'mean_ms': 1.9,  'p95_ms': 2.4,    'min_ms': 1.7}  ✅</span>`
        }
      ],
      ml: [
        {
          tab: 'regression.py',
          lang: 'python',
          title: 'Regression Models (Python)',
          desc: 'Python implementation of all regression algorithms in the ML Lab. Uses scikit-learn with bias-variance analysis.',
          stack: ['python', 'sklearn', 'numpy'],
          code: `<span class="cm"># regression.py — All regression models from ML Lab</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> PolynomialFeatures
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>)

<span class="cm"># Degree-8 polynomial: OVERFIT example</span>
overfit_model = <span class="cls">Pipeline</span>([
    (<span class="str">'poly'</span>, <span class="cls">PolynomialFeatures</span>(degree=<span class="num">8</span>)),
    (<span class="str">'reg'</span>,  <span class="cls">LinearRegression</span>())
])
overfit_model.<span class="fn">fit</span>(X_train, y_train)
<span class="kw">print</span>(<span class="str">f"Train R²: {overfit_model.score(X_train, y_train):.3f}"</span>)  <span class="cm"># 0.99</span>
<span class="kw">print</span>(<span class="str">f"Test  R²: {overfit_model.score(X_test, y_test):.3f}"</span>)   <span class="cm"># 0.61 ⚠ overfit</span>

<span class="cm"># Random Forest: best generalisation</span>
rf = <span class="cls">RandomForestRegressor</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">8</span>)
cv_scores = <span class="fn">cross_val_score</span>(rf, X, y, cv=<span class="num">5</span>, scoring=<span class="str">'r2'</span>)
<span class="kw">print</span>(<span class="str">f"CV R²:    {cv_scores.mean():.3f} ± {cv_scores.std():.3f}"</span>) <span class="cm"># 0.91 ✅</span>`
        },
        {
          tab: 'classification.py',
          lang: 'python',
          title: 'Classification (Python)',
          desc: 'SVM, KNN, and Random Forest classifiers with confusion matrix output and F1 optimization — exactly what runs in the Classification Arena.',
          stack: ['python', 'sklearn'],
          code: `<span class="cm"># classification.py — Arena classifiers + evaluation</span>
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (classification_report,
                               confusion_matrix, f1_score)
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

<span class="cm"># Scale features (critical for SVM & KNN)</span>
scaler = <span class="cls">StandardScaler</span>()
X_train_s = scaler.<span class="fn">fit_transform</span>(X_train)
X_test_s  = scaler.<span class="fn">transform</span>(X_test)

<span class="cm"># SVM with RBF kernel — best in class</span>
svm = <span class="cls">SVC</span>(kernel=<span class="str">'rbf'</span>, C=<span class="num">1.0</span>, gamma=<span class="str">'scale'</span>, probability=<span class="kw">True</span>)
svm.<span class="fn">fit</span>(X_train_s, y_train)
y_pred = svm.<span class="fn">predict</span>(X_test_s)

f1 = <span class="fn">f1_score</span>(y_test, y_pred, average=<span class="str">'weighted'</span>)
<span class="kw">print</span>(<span class="str">f"F1 Score: {f1:.3f}"</span>)  <span class="cm"># 0.930 ✅</span>
<span class="kw">print</span>(<span class="fn">classification_report</span>(y_test, y_pred))
<span class="kw">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))`
        },
        {
          tab: 'rl_bandit.py',
          lang: 'python',
          title: 'RL: Multi-Armed Bandit (Python)',
          desc: 'Thompson Sampling and UCB1 implementations for the Reinforcement Learning Arena. Demonstrates exploration-exploitation tradeoff.',
          stack: ['python', 'numpy'],
          code: `<span class="cm"># rl_bandit.py — Multi-armed bandit algorithms</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> <span class="cls">ThompsonSampling</span>:
    <span class="cm">"""Bayesian exploration — best performer in RL Arena"""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_arms):
        self.alpha = np.<span class="fn">ones</span>(n_arms)   <span class="cm"># successes + 1</span>
        self.beta  = np.<span class="fn">ones</span>(n_arms)   <span class="cm"># failures + 1</span>

    <span class="kw">def</span> <span class="fn">select_arm</span>(self) -> int:
        samples = np.random.<span class="fn">beta</span>(self.alpha, self.beta)
        <span class="kw">return</span> int(np.<span class="fn">argmax</span>(samples))

    <span class="kw">def</span> <span class="fn">update</span>(self, arm: int, reward: int):
        self.alpha[arm] += reward
        self.beta[arm]  += (<span class="num">1</span> - reward)

<span class="kw">class</span> <span class="cls">UCB1</span>:
    <span class="cm">"""Upper Confidence Bound — provably near-optimal"""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_arms):
        self.counts  = np.<span class="fn">zeros</span>(n_arms)
        self.rewards = np.<span class="fn">zeros</span>(n_arms)
        self.t = <span class="num">0</span>

    <span class="kw">def</span> <span class="fn">select_arm</span>(self) -> int:
        self.t += <span class="num">1</span>
        ucb = self.rewards + np.<span class="fn">sqrt</span>(
            <span class="num">2</span> * np.<span class="fn">log</span>(self.t) / (self.counts + <span class="num">1e-5</span>)
        )
        <span class="kw">return</span> int(np.<span class="fn">argmax</span>(ucb))`
        }
      ],
      devops: [
        {
          tab: 'pipeline.sh',
          lang: 'bash',
          title: 'CI/CD Pipeline (Bash)',
          desc: 'Bash pipeline script that mirrors the DevOps Arena. Each stage runs, checks exit code, and fails fast on errors.',
          stack: ['bash', 'docker'],
          code: `<span class="cm">#!/bin/bash
# pipeline.sh — CI/CD pipeline mirroring the DevOps Arena</span>
<span class="kw">set</span> -eo pipefail

<span class="fn">log</span>() { echo <span class="str">"[$(date +%H:%M:%S)] $1"</span>; }
<span class="fn">stage</span>() { echo; echo <span class="str">"━━━ $1 ━━━"</span>; }

<span class="fn">stage</span> <span class="str">"SOURCE CHECKOUT"</span>
git <span class="fn">fetch</span> origin main && git <span class="fn">checkout</span> main

<span class="fn">stage</span> <span class="str">"LINT"</span>
<span class="fn">flake8</span> src/ --max-line-length=<span class="num">100</span>
<span class="fn">log</span> <span class="str">"✅ Lint passed"</span>

<span class="fn">stage</span> <span class="str">"UNIT TESTS"</span>
<span class="fn">pytest</span> tests/unit/ --cov=src --cov-fail-under=<span class="num">80</span>
<span class="fn">log</span> <span class="str">"✅ Coverage > 80%"</span>

<span class="fn">stage</span> <span class="str">"BUILD & DOCKERIZE"</span>
docker <span class="fn">build</span> -t app:<span class="str">"$GIT_SHA"</span> .
docker <span class="fn">push</span> registry/app:<span class="str">"$GIT_SHA"</span>

<span class="fn">stage</span> <span class="str">"CANARY DEPLOY (10%)"</span>
kubectl <span class="fn">set</span> image deployment/app-canary app=app:<span class="str">"$GIT_SHA"</span>
sleep <span class="num">30</span>
ERROR_RATE=$(<span class="fn">curl</span> -s metrics/canary/error_rate)
<span class="kw">if</span> (( <span class="fn">$(echo "$ERROR_RATE > 0.01" | bc -l)</span> )); <span class="kw">then</span>
    <span class="fn">log</span> <span class="str">"❌ Canary error rate high — rolling back"</span>
    kubectl <span class="fn">rollout</span> undo deployment/app-canary; exit <span class="num">1</span>
<span class="kw">fi</span>

<span class="fn">stage</span> <span class="str">"FULL PRODUCTION DEPLOY"</span>
kubectl <span class="fn">set</span> image deployment/app app=app:<span class="str">"$GIT_SHA"</span>
<span class="fn">log</span> <span class="str">"🚀 Deployed successfully"</span>`
        },
        {
          tab: 'Dockerfile',
          lang: 'docker',
          title: 'Dockerfile',
          desc: 'Multi-stage Docker build for a Python backend — minimizes final image size and uses non-root user for security.',
          stack: ['docker', 'bash'],
          code: `<span class="cm"># Dockerfile — Multi-stage production build</span>

<span class="cm"># Stage 1: Build dependencies</span>
<span class="kw">FROM</span> python:<span class="str">3.12-slim</span> <span class="kw">AS</span> builder
<span class="kw">WORKDIR</span> /build
<span class="kw">COPY</span> requirements.txt .
<span class="kw">RUN</span> pip install --user --no-cache-dir -r requirements.txt

<span class="cm"># Stage 2: Runtime — no build tools, smaller attack surface</span>
<span class="kw">FROM</span> python:<span class="str">3.12-slim</span>
<span class="kw">WORKDIR</span> /app

<span class="cm"># Non-root user for security</span>
<span class="kw">RUN</span> useradd --uid <span class="num">1000</span> --no-create-home appuser

<span class="cm"># Copy only installed packages from builder</span>
<span class="kw">COPY</span> --from=builder /root/.local /home/appuser/.local
<span class="kw">COPY</span> --chown=appuser:appuser src/ .

<span class="kw">USER</span> appuser
<span class="kw">EXPOSE</span> <span class="num">8000</span>
<span class="kw">HEALTHCHECK</span> --interval=30s --timeout=3s \
    <span class="kw">CMD</span> curl -f http://localhost:8000/health || exit 1

<span class="cm"># Graceful shutdown supported</span>
<span class="kw">CMD</span> [<span class="str">"python"</span>, <span class="str">"-m"</span>, <span class="str">"uvicorn"</span>, <span class="str">"main:app"</span>, \
     <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]`
        }
      ]
    };

export let codeDrawerRealm = null;
export let codeTabIdx = 0;

export let codeDrawerIsDragging = false;
export let codeDrawerStartY = 0;
export let codeDrawerStartHeight = 0;

export function initCodeDrawerResizer() {
      const resizer = document.getElementById('code-drawer-resizer');
      const drawer = document.getElementById('code-drawer');

      resizer.addEventListener('mousedown', (e) => {
        codeDrawerIsDragging = true;
        codeDrawerStartY = e.clientY;
        const computed = window.getComputedStyle(drawer);
        codeDrawerStartHeight = parseInt(computed.height, 10);
        drawer.classList.add('dragging');
        document.body.style.cursor = 'ns-resize';
      });

      document.addEventListener('mousemove', (e) => {
        if (!codeDrawerIsDragging) return;
        const dy = codeDrawerStartY - e.clientY;
        let newHeight = codeDrawerStartHeight + dy;
        if (newHeight < 200) newHeight = 200;
        if (newHeight > window.innerHeight * 0.9) newHeight = window.innerHeight * 0.9;
        drawer.style.height = newHeight + 'px';
      });

      document.addEventListener('mouseup', () => {
        if (codeDrawerIsDragging) {
          codeDrawerIsDragging = false;
          drawer.classList.remove('dragging');
          document.body.style.cursor = 'default';
        }
      });
    }

    window.addEventListener('DOMContentLoaded', initCodeDrawerResizer);

export function openCodeDrawer(realm) {
      codeDrawerRealm = realm;
      codeTabIdx = 0;
      renderCodeDrawer();
      $('code-drawer').classList.add('open');
    }

export function closeCodeDrawer() {
      $('code-drawer').classList.remove('open');
      $('code-drawer').style.height = '';
    }

export function renderCodeDrawer() {
      const snippets = CODE_SNIPPETS[codeDrawerRealm];
      if (!snippets) return;

      // Tabs
      $('code-tabs').innerHTML = snippets.map((s, i) =>
        `<button class="code-tab ${i === codeTabIdx ? 'active' : ''}" onclick="switchCodeTab(${i})">${s.tab}</button>`
      ).join('');

      const s = snippets[codeTabIdx];

      // Info panel
      const stackBadges = s.stack.map(t => `<span class="tech-badge ${t}">${t}</span>`).join('');
      $('code-info').innerHTML = `
    <h4>${s.title}</h4>
    <p>${s.desc}</p>
    <div class="stack-row">${stackBadges}</div>
    <div style="font-family:'Share Tech Mono',monospace;font-size:0.55rem;color:var(--blood);letter-spacing:0.08em;margin-top:0.5rem">
      // This is the actual implementation behind the ${codeDrawerRealm} realm
    </div>
  `;

      $('code-area').innerHTML = s.code;
    }

export function switchCodeTab(idx) {
      codeTabIdx = idx;
      renderCodeDrawer();
    }

    // ═══════════════════════════════════════
