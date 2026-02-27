import { toast } from '../ui/toast.js';

    // BACKEND SANDBOX LOGIC
    // ═══════════════════════════════════════
export const BACKEND_LANGS = {
      node: {
        code: `<span class="kw">const</span> express = <span class="fn">require</span>(<span class="str">'express'</span>);
<span class="kw">const</span> app = <span class="fn">express</span>();
<span class="kw">const</span> port = process.env.PORT || <span class="num">8080</span>;

app.<span class="fn">use</span>(express.<span class="fn">json</span>());

<span class="cm">// Middleware for logging</span>
app.<span class="fn">use</span>((req, res, next) => {
  console.<span class="fn">log</span>(<span class="str">\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`</span>);
  <span class="fn">next</span>();
});

app.<span class="fn">get</span>(<span class="str">'/api/users'</span>, <span class="kw">async</span> (req, res) => {
  <span class="kw">const</span> users = <span class="kw">await</span> db.<span class="fn">query</span>(<span class="str">'SELECT * FROM users LIMIT 10'</span>);
  res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">json</span>(users);
});

app.<span class="fn">post</span>(<span class="str">'/api/auth'</span>, (req, res) => {
  <span class="cm">// mock authentication</span>
  res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">json</span>({ token: <span class="str">'jwt_token_here'</span> });
});

app.<span class="fn">get</span>(<span class="str">'/health'</span>, (req, res) => {
  res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">send</span>(<span class="str">'OK'</span>);
});

app.<span class="fn">listen</span>(port, () => {
  console.<span class="fn">log</span>(<span class="str">\`🚀 Server up and running on port \${port}\`</span>);
});`,
        cmd: "node server.js",
        bootMsgs: [
          { msg: "Loading dependencies...", delay: 200, type: "system" },
          { msg: "Connecting to PostgreSQL database...", delay: 500, type: "system" },
          { msg: "DB Connected successfully.", delay: 400, type: "success" },
          { msg: "🚀 Server up and running on port 8080", delay: 100, type: "info" }
        ],
        reqMap: {
          'GET /api/users': [
            { msg: "[2026-02-26T12:00:00.000Z] GET /api/users", delay: 50, type: "info" },
            { msg: "Executing query: SELECT * FROM users LIMIT 10", delay: 200, type: "system" },
            { msg: "Query OK, 10 rows returned (12ms)", delay: 150, type: "success" },
            { msg: "Response sent: 200 OK", delay: 50, type: "success" }
          ],
          'POST /api/auth': [
            { msg: "[2026-02-26T12:00:15.000Z] POST /api/auth", delay: 50, type: "info" },
            { msg: "Verifying credentials against hashed DB records...", delay: 300, type: "system" },
            { msg: "Generating JWT Token (HS256)...", delay: 100, type: "system" },
            { msg: "Response sent: 200 OK", delay: 50, type: "success" }
          ],
          'GET /health': [
            { msg: "[2026-02-26T12:00:30.000Z] GET /health", delay: 20, type: "info" },
            { msg: "Response sent: 200 OK", delay: 30, type: "success" }
          ]
        }
      },
      python: {
        code: `<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends
<span class="kw">import</span> uvicorn
<span class="kw">import</span> logging

app = <span class="fn">FastAPI</span>(title=<span class="str">"Arcade API"</span>)
logger = logging.<span class="fn">getLogger</span>(<span class="str">"uvicorn"</span>)

<span class="dec">@app.on_event</span>(<span class="str">"startup"</span>)
<span class="kw">async def</span> <span class="fn">startup_event</span>():
    logger.<span class="fn">info</span>(<span class="str">"Connecting to database pool..."</span>)
    logger.<span class="fn">info</span>(<span class="str">"Server started perfectly."</span>)

<span class="dec">@app.get</span>(<span class="str">"/api/users"</span>)
<span class="kw">async def</span> <span class="fn">get_users</span>():
    logger.<span class="fn">info</span>(<span class="str">"Handling GET /api/users"</span>)
    <span class="cm"># Mock async DB call</span>
    <span class="kw">return</span> {<span class="str">"users"</span>: [<span class="str">"user1"</span>, <span class="str">"user2"</span>, <span class="str">"user3"</span>]}

<span class="dec">@app.post</span>(<span class="str">"/api/auth"</span>)
<span class="kw">async def</span> <span class="fn">authenticate</span>():
    logger.<span class="fn">info</span>(<span class="str">"Handling POST /api/auth"</span>)
    <span class="kw">return</span> {<span class="str">"access_token"</span>: <span class="str">"mock_jwt_token"</span>, <span class="str">"token_type"</span>: <span class="str">"bearer"</span>}

<span class="dec">@app.get</span>(<span class="str">"/health"</span>)
<span class="kw">async def</span> <span class="fn">health_check</span>():
    <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"healthy"</span>}

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    uvicorn.<span class="fn">run</span>(app, host=<span class="str">"0.0.0.0"</span>, port=<span class="num">8080</span>)`,
        cmd: "python main.py",
        bootMsgs: [
          { msg: "INFO:     Started server process [10234]", delay: 200, type: "system" },
          { msg: "INFO:     Waiting for application startup.", delay: 100, type: "system" },
          { msg: "INFO:     Connecting to database pool...", delay: 400, type: "system" },
          { msg: "INFO:     Server started perfectly.", delay: 50, type: "success" },
          { msg: "INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)", delay: 100, type: "info" }
        ],
        reqMap: {
          'GET /api/users': [
            { msg: "INFO:     127.0.0.1:54321 - \"GET /api/users HTTP/1.1\" 200 OK", delay: 100, type: "info" },
            { msg: "INFO:     Handling GET /api/users", delay: 50, type: "system" }
          ],
          'POST /api/auth': [
            { msg: "INFO:     127.0.0.1:54322 - \"POST /api/auth HTTP/1.1\" 200 OK", delay: 200, type: "info" },
            { msg: "INFO:     Handling POST /api/auth", delay: 50, type: "system" }
          ],
          'GET /health': [
            { msg: "INFO:     127.0.0.1:54323 - \"GET /health HTTP/1.1\" 200 OK", delay: 30, type: "info" }
          ]
        }
      },
      java: {
        code: `<span class="kw">package</span> com.arcade.api;

<span class="kw">import</span> org.springframework.boot.SpringApplication;
<span class="kw">import</span> org.springframework.boot.autoconfigure.SpringBootApplication;
<span class="kw">import</span> org.springframework.web.bind.annotation.*;
<span class="kw">import</span> org.slf4j.Logger;
<span class="kw">import</span> org.slf4j.LoggerFactory;

<span class="dec">@SpringBootApplication</span>
<span class="dec">@RestController</span>
<span class="kw">public class</span> <span class="cls">ArcadeApiApplication</span> {
    
    <span class="kw">private static final</span> <span class="cls">Logger</span> log = <span class="cls">LoggerFactory</span>.<span class="fn">getLogger</span>(<span class="cls">ArcadeApiApplication</span>.<span class="kw">class</span>);

    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cls">String</span>[] args) {
        <span class="cls">SpringApplication</span>.<span class="fn">run</span>(<span class="cls">ArcadeApiApplication</span>.<span class="kw">class</span>, args);
    }

    <span class="dec">@GetMapping</span>(<span class="str">"/api/users"</span>)
    <span class="kw">public</span> <span class="cls">String</span> <span class="fn">getUsers</span>() {
        log.<span class="fn">info</span>(<span class="str">"Fetching users from repository..."</span>);
        <span class="kw">return</span> <span class="str">"[{ \"user\": \"admin\" }]"</span>;
    }

    <span class="dec">@PostMapping</span>(<span class="str">"/api/auth"</span>)
    <span class="kw">public</span> <span class="cls">String</span> <span class="fn">authenticate</span>() {
        log.<span class="fn">info</span>(<span class="str">"Authenticating user..."</span>);
        <span class="kw">return</span> <span class="str">"{ \"token\": \"spring_jwt_mock\" }"</span>;
    }

    <span class="dec">@GetMapping</span>(<span class="str">"/health"</span>)
    <span class="kw">public</span> <span class="cls">String</span> <span class="fn">health</span>() {
        <span class="kw">return</span> <span class="str">"UP"</span>;
    }
}`,
        cmd: "mvn spring-boot:run",
        bootMsgs: [
          { msg: "  .   ____          _            __ _ _", delay: 50, type: "system" },
          { msg: " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\", delay: 50, type: "system" },
          { msg: "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\", delay: 50, type: "system" },
          { msg: " \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )", delay: 50, type: "system" },
          { msg: "  '  |____| .__|_| |_|_| |_\\__, | / / / /", delay: 50, type: "system" },
          { msg: " =========|_|==============|___/=/_/_/_/", delay: 50, type: "system" },
          { msg: " :: Spring Boot ::                (v3.1.2)", delay: 200, type: "info" },
          { msg: "2026-02-26T12:00:00.000Z  INFO 12345 --- [           main] c.a.api.ArcadeApiApplication             : Starting ArcadeApiApplication", delay: 300, type: "system" },
          { msg: "2026-02-26T12:00:01.200Z  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)", delay: 400, type: "system" },
          { msg: "2026-02-26T12:00:02.500Z  INFO 12345 --- [           main] c.a.api.ArcadeApiApplication             : Started ArcadeApiApplication in 2.893 seconds", delay: 200, type: "success" }
        ],
        reqMap: {
          'GET /api/users': [
            { msg: "2026-02-26T12:05:00.000Z  INFO 12345 --- [nio-8080-exec-1] c.a.api.ArcadeApiApplication             : Fetching users from repository...", delay: 200, type: "system" },
            { msg: "2026-02-26T12:05:00.050Z DEBUG 12345 --- [nio-8080-exec-1] org.hibernate.SQL                        : select * from users limit ?", delay: 100, type: "system" }
          ],
          'POST /api/auth': [
            { msg: "2026-02-26T12:06:00.000Z  INFO 12345 --- [nio-8080-exec-2] c.a.api.ArcadeApiApplication             : Authenticating user...", delay: 150, type: "system" },
            { msg: "2026-02-26T12:06:00.200Z DEBUG 12345 --- [nio-8080-exec-2] o.s.s.a.ProviderManager                  : Authentication attempt using DaoAuthenticationProvider", delay: 100, type: "system" }
          ],
          'GET /health': [
            { msg: "2026-02-26T12:07:00.000Z DEBUG 12345 --- [nio-8080-exec-3] o.s.w.s.DispatcherServlet                : Completed 200 OK", delay: 50, type: "success" }
          ]
        }
      }
    };

export let activeBackendLang = 'node';
export let isServerRunning = false;
export let beTermInterval = null;

export function showToast(msg, type = 'info') {
      const container = document.getElementById('toasts');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerText = msg;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

export function switchBackendLang(lang) {
      if (isServerRunning) {
        showToast("Stop the server first before switching languages.", "warn");
        return;
      }
      activeBackendLang = lang;
      document.querySelectorAll('.ide-tab').forEach(t => t.classList.remove('active'));
      const tabGroup = document.getElementById(`tab-${lang}`);
      if (tabGroup) tabGroup.classList.add('active');
      const codeArea = document.getElementById('backend-code-area');
      if (codeArea) {
        codeArea.innerHTML = BACKEND_LANGS[lang].code;
        codeArea.scrollTop = 0;
      }
      clearTerminal();
    }

export function executeBackend() {
      const btn = document.querySelector('.run-server-btn');
      if (isServerRunning) {
        isServerRunning = false;
        btn.classList.remove('running');
        btn.innerHTML = '▶ RUN SERVER';
        appendTerminalLine(`^C`, 'info');
        appendTerminalLine(`Server stopped.`, 'error');
        updateBackendStatus(false);
        setMockButtons(false);
      } else {
        isServerRunning = true;
        btn.classList.add('running');
        btn.innerHTML = '■ STOP SERVER';
        clearTerminal();
        const conf = BACKEND_LANGS[activeBackendLang];
        appendTerminalLine(`guest@arcade:~/backend$ ${conf.cmd}`, 'prompt');
        updateBackendStatus(true);
        processTermQueue(conf.bootMsgs, () => {
          setMockButtons(true);
        });
      }
    }

export function appendTerminalLine(text, type = 'info') {
      const tb = document.getElementById('backend-terminal-output');
      const div = document.createElement('div');
      div.className = `term-line ${type}`;
      div.innerText = text;
      const cursors = tb.querySelectorAll('.prompt');
      let cursorEl = null;
      if (cursors.length > 0 && cursors[cursors.length - 1].innerText.includes('_')) {
        cursorEl = cursors[cursors.length - 1];
      }
      if (cursorEl) {
        tb.insertBefore(div, cursorEl);
      } else {
        tb.appendChild(div);
      }
      // Ensure bottom scroll
      setTimeout(() => { tb.scrollTop = tb.scrollHeight; }, 10);
    }

export function clearTerminal() {
      const tb = document.getElementById('backend-terminal-output');
      if (tb) tb.innerHTML = '<div class="term-line prompt">guest@arcade:~/backend$ <span class="cursor-blink">_</span></div>';
    }

export function updateBackendStatus(running) {
      const val = document.getElementById('be-status-val');
      const bar = document.getElementById('be-status-bar');
      const mem = document.getElementById('be-mem-val');

      if (running) {
        val.innerText = "ONLINE";
        val.style.color = "#00cc66";
        bar.style.width = "100%";
        bar.style.background = "#00cc66";
        mem.innerText = activeBackendLang === 'java' ? '256MB' : (activeBackendLang === 'python' ? '45MB' : '32MB');
        showToast(`${activeBackendLang.toUpperCase()} server started`, "success");
      } else {
        val.innerText = "OFFLINE";
        val.style.color = "var(--ash)";
        bar.style.width = "0%";
        bar.style.background = "var(--crimson)";
        mem.innerText = "0MB";
      }
    }

export function setMockButtons(enabled) {
      ['btn-req-1', 'btn-req-2', 'btn-req-3'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = !enabled;
      });
    }

export function sendMockRequest(reqString) {
      if (!isServerRunning) return;
      const conf = BACKEND_LANGS[activeBackendLang];
      const msgs = conf.reqMap[reqString];
      if (msgs) {
        appendTerminalLine(`--> Mocking request: ${reqString}`, 'system');
        processTermQueue(msgs, () => { });
      }
    }

export function processTermQueue(msgs, callback) {
      let i = 0;
      function next() {
        if (!isServerRunning) return;
        if (i >= msgs.length) {
          if (callback) callback();
          return;
        }
        const m = msgs[i];
        setTimeout(() => {
          if (isServerRunning) {
            appendTerminalLine(m.msg, m.type);
            i++;
            next();
          }
        }, m.delay || 100);
      }
      next();
    }

    // Run initialization manually
    document.addEventListener('DOMContentLoaded', () => {
      switchBackendLang('node');
    });

    // ═══════════════════════════════════════
