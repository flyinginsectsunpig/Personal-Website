import {$,  DOM } from '../config/dom.js';
import { closeCodeDrawer } from './hire.js';

// PROJECTS CODE VIEWER
// ═══════════════════════════════════════
export const PROJECT_CODE = [
  {
    tabs: ['canvas_engine.js', 'zone_system.py'],
    info: {
      title: 'RPG Portfolio Engine',
      desc: 'Canvas-based RPG world. Character movement uses requestAnimationFrame with grid collision detection. Zone proximity triggers interactive modals.',
      stack: ['js', 'canvas', 'python']
    },
    snippets: [
      `<span class="cm">// canvas_engine.js — Character movement + collision</span>
<span class="kw">const</span> TILE = <span class="num">32</span>;
<span class="kw">const</span> player = { x: <span class="num">5</span>, y: <span class="num">5</span>, speed: <span class="num">0.15</span> };

<span class="kw">function</span> <span class="fn">gameLoop</span>(ts) {
  ctx.<span class="fn">clearRect</span>(<span class="num">0</span>, <span class="num">0</span>, canvas.width, canvas.height);
  <span class="fn">drawMap</span>();

  <span class="kw">if</span> (keys.ArrowUp && !<span class="fn">isBlocked</span>(player.x, player.y - player.speed))
    player.y -= player.speed;
  <span class="kw">if</span> (keys.ArrowDown && !<span class="fn">isBlocked</span>(player.x, player.y + player.speed))
    player.y += player.speed;

  <span class="fn">checkZoneProximity</span>(player);
  <span class="fn">drawPlayer</span>(player.x * TILE, player.y * TILE);
  requestAnimationFrame(gameLoop);
}

<span class="kw">function</span> <span class="fn">isBlocked</span>(x, y) {
  <span class="kw">const</span> tile = MAP[<span class="fn">Math.floor</span>(y)][<span class="fn">Math.floor</span>(x)];
  <span class="kw">return</span> tile === <span class="num">1</span>; <span class="cm">// 1 = wall</span>
}`,
      `<span class="cm"># zone_system.py — Generates zone data loaded by the canvas engine</span>
<span class="kw">from</span> dataclasses <span class="kw">import</span> dataclass
<span class="kw">from</span> typing <span class="kw">import</span> List
<span class="kw">import</span> json

<span class="dec">@dataclass</span>
<span class="kw">class</span> <span class="cls">Zone</span>:
    name: str
    x: int; y: int
    width: int; height: int
    modal_type: str
    unlock_xp: int = <span class="num">0</span>

zones: List[<span class="cls">Zone</span>] = [
    <span class="cls">Zone</span>(<span class="str">"ML Lab"</span>,      <span class="num">8</span>,  <span class="num">3</span>,  <span class="num">5</span>, <span class="num">4</span>, <span class="str">"regression"</span>),
    <span class="cls">Zone</span>(<span class="str">"DB Dungeon"</span>,  <span class="num">16</span>, <span class="num">8</span>,  <span class="num">4</span>, <span class="num">4</span>, <span class="str">"sql_boss"</span>),
    <span class="cls">Zone</span>(<span class="str">"DevOps Bay"</span>,  <span class="num">4</span>,  <span class="num">14</span>, <span class="num">6</span>, <span class="num">3</span>, <span class="str">"pipeline"</span>),
]

<span class="kw">with</span> <span class="fn">open</span>(<span class="str">'zones.json'</span>, <span class="str">'w'</span>) <span class="kw">as</span> f:
    json.<span class="fn">dump</span>([vars(z) <span class="kw">for</span> z <span class="kw">in</span> zones], f, indent=<span class="num">2</span>)`
    ]
  },
  {
    tabs: ['pipeline.py', 'model_select.py'],
    info: {
      title: 'ML Pipeline Project',
      desc: 'End-to-end ML pipeline. Data preprocessing through model selection and cross-validation. Mirrors exactly what you interact with in the ML Lab.',
      stack: ['python', 'sklearn', 'numpy']
    },
    snippets: [
      `<span class="cm"># pipeline.py — Full sklearn ML pipeline</span>
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, LabelEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV

preprocessor = Pipeline([
    (<span class="str">'impute'</span>,  <span class="cls">SimpleImputer</span>(strategy=<span class="str">'median'</span>)),
    (<span class="str">'scale'</span>,   <span class="cls">StandardScaler</span>()),
])

model = Pipeline([
    (<span class="str">'pre'</span>,   preprocessor),
    (<span class="str">'clf'</span>,   <span class="cls">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>)),
])

param_grid = {
    <span class="str">'clf__max_depth'</span>:     [<span class="num">5</span>, <span class="num">10</span>, <span class="num">None</span>],
    <span class="str">'clf__n_estimators'</span>: [<span class="num">50</span>, <span class="num">100</span>, <span class="num">200</span>],
}
search = <span class="cls">GridSearchCV</span>(model, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">'f1_weighted'</span>)
search.<span class="fn">fit</span>(X_train, y_train)
<span class="kw">print</span>(<span class="str">f"Best F1: {search.best_score_:.3f}"</span>)`,
      `<span class="cm"># model_select.py — Cross-validation model comparison</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_validate

models = {
    <span class="str">'Random Forest'</span>: <span class="cls">RandomForestClassifier</span>(),
    <span class="str">'SVM RBF'</span>:       <span class="cls">SVC</span>(kernel=<span class="str">'rbf'</span>),
    <span class="str">'Logistic Reg'</span>:  <span class="cls">LogisticRegression</span>(),
}

results = {}
<span class="kw">for</span> name, clf <span class="kw">in</span> models.<span class="fn">items</span>():
    cv = <span class="fn">cross_validate</span>(clf, X, y, cv=<span class="num">5</span>,
                        scoring=[<span class="str">'f1_weighted'</span>, <span class="str">'accuracy'</span>])
    results[name] = {
        <span class="str">'f1'</span>:  cv[<span class="str">'test_f1_weighted'</span>].<span class="fn">mean</span>(),
        <span class="str">'acc'</span>: cv[<span class="str">'test_accuracy'</span>].<span class="fn">mean</span>(),
    }
<span class="cm"># Random Forest → F1: 0.940  ✅
# SVM RBF       → F1: 0.928
# Logistic Reg  → F1: 0.883</span>`
    ]
  },
  {
    tabs: ['ApiServer.java', 'ConnectionPool.java'],
    info: {
      title: 'Backend API System',
      desc: 'Java REST API with PostgreSQL, JDBC connection pooling, and request routing. Implements the same patterns shown in the System Realm.',
      stack: ['java', 'sql', 'docker']
    },
    snippets: [
      `<span class="cm">// ApiServer.java — Lightweight HTTP server with routing</span>
<span class="kw">import</span> com.sun.net.httpserver.*;
<span class="kw">import</span> java.io.*;
<span class="kw">import</span> java.net.InetSocketAddress;

<span class="kw">public class</span> <span class="cls">ApiServer</span> {
    <span class="kw">private final</span> <span class="cls">HttpServer</span> server;
    <span class="kw">private final</span> <span class="cls">Router</span> router;

    <span class="kw">public</span> <span class="fn">ApiServer</span>(int port) <span class="kw">throws</span> <span class="cls">IOException</span> {
        server = <span class="cls">HttpServer</span>.<span class="fn">create</span>(<span class="kw">new</span> <span class="cls">InetSocketAddress</span>(port), <span class="num">0</span>);
        router = <span class="kw">new</span> <span class="cls">Router</span>();
        server.<span class="fn">createContext</span>(<span class="str">"/"</span>, exchange -> {
            <span class="cls">String</span> path   = exchange.getRequestURI().getPath();
            <span class="cls">String</span> method = exchange.getRequestMethod();
            router.<span class="fn">handle</span>(path, method, exchange);
        });
        server.<span class="fn">setExecutor</span>(<span class="cls">Executors</span>.<span class="fn">newVirtualThreadPerTaskExecutor</span>());
    }

    <span class="kw">public void</span> <span class="fn">start</span>() {
        server.<span class="fn">start</span>();
        <span class="cls">System</span>.out.<span class="fn">println</span>(<span class="str">"API server running on port "</span> + server.<span class="fn">getAddress</span>().getPort());
    }
}`,
      `<span class="cm">// ConnectionPool.java — JDBC connection pool</span>
<span class="kw">import</span> java.sql.*;
<span class="kw">import</span> java.util.concurrent.*;

<span class="kw">public class</span> <span class="cls">ConnectionPool</span> {
    <span class="kw">private final</span> BlockingQueue&lt;<span class="cls">Connection</span>&gt; pool;
    <span class="kw">private final int</span> MAX_SIZE = <span class="num">10</span>;

    <span class="kw">public</span> <span class="fn">ConnectionPool</span>(<span class="cls">String</span> url) <span class="kw">throws</span> <span class="cls">SQLException</span> {
        pool = <span class="kw">new</span> <span class="cls">ArrayBlockingQueue</span>&lt;&gt;(MAX_SIZE);
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i &lt; MAX_SIZE; i++)
            pool.<span class="fn">offer</span>(<span class="cls">DriverManager</span>.<span class="fn">getConnection</span>(url));
    }

    <span class="kw">public</span> <span class="cls">Connection</span> <span class="fn">acquire</span>() <span class="kw">throws</span> <span class="cls">InterruptedException</span> {
        <span class="kw">return</span> pool.<span class="fn">poll</span>(<span class="num">5</span>, <span class="cls">TimeUnit</span>.SECONDS);
    }

    <span class="kw">public void</span> <span class="fn">release</span>(<span class="cls">Connection</span> conn) {
        pool.<span class="fn">offer</span>(conn); <span class="cm">// return to pool</span>
    }
}`
    ]
  }
];

export function openProjectCode(idx) {
  const proj = PROJECT_CODE[idx];
  if (!proj) return;

  const tabsHtml = proj.tabs.map((t, i) =>
    `<button class="code-tab ${i === 0 ? 'active' : ''}" onclick="switchProjectCodeTab(${idx}, ${i}, this)">${t}</button>`
  ).join('');

  $('code-tabs').innerHTML = tabsHtml;

  const stackBadges = proj.info.stack.map(t => `<span class="tech-badge ${t}">${t}</span>`).join('');
  $('code-info').innerHTML = `
    <h4>${proj.info.title}</h4>
    <p>${proj.info.desc}</p>
    <div class="stack-row">${stackBadges}</div>
  `;
  $('code-area').innerHTML = proj.snippets[0];
  $('code-drawer').classList.add('open');
}

export function switchProjectCodeTab(projIdx, tabIdx, btn) {
  document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  $('code-area').innerHTML = PROJECT_CODE[projIdx].snippets[tabIdx] || '';
}


// ═══════════════════════════════════════
