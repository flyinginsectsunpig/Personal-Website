import {$,  DOM, callGemini } from '../config/dom.js';
import { WARP_LINE_COUNT, WARP_SPEED, PARTICLE_COUNT, SIM_TICK_MS, AUTO_EVENT_COOLDOWN, AUTO_EVENT_CHANCE, MAX_QUEUE_DEPTH, CURSOR_HOVER_SIZE, CURSOR_DEFAULT_SIZE, CURSOR_LERP, GEMINI_MODEL, GEMINI_PROXY_URL, GEMINI_MAX_TOKENS, GEMINI_TEMP_BOSS, GEMINI_TEMP_CHAT, TOAST_DURATION_MS, TOAST_FADE_MS } from '../config/constants.js';
import { currentRealm } from '../core/screen.js';

// CHATBOT (GEMINI)
// ═══════════════════════════════════════
export let chatOpen = false;
export let chatMode = 'explain';

export function toggleChat() {
  chatOpen = !chatOpen;
  $('chat-panel').classList.toggle('open', chatOpen);
}

export function setChatMode(mode) {
  chatMode = mode;
  document.querySelectorAll('.chat-mode-btn').forEach(b => b.classList.remove('active'));
  $('mode-' + mode)?.classList.add('active');

  const hints = {
    explain: 'Ask me to explain any concept from this arcade — algorithms, system design, DB optimisation, CI/CD. Or ask about Zakhir\'s projects and experience.',
    interview: 'I\'ll run a mock backend or ML interview with you. Answer my questions and I\'ll give honest, scored feedback. Type "start" to begin.',
    about: 'Ask me anything about Zakhir — his skills, projects, experience at COGENT, or why you should hire him.',
  };
  addChatMsg('bot', hints[mode]);
}

export function addChatMsg(role, text) {
  const msgs = DOM.chatMessages;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

// ── Zakhir's profile — injected into every prompt so The Oracle knows who built this ──
export const ZAKHIR_PROFILE = `
ABOUT THE DEVELOPER — Zakhir Keane McKinnon:
- Junior software developer based in South Africa
- Diploma: ICT in Applications Development, Cape Peninsula University of Technology (2025)
- 5 months Work Integrated Learning at COGENT (Aug–Dec 2025): Azure DevOps, C#, ABP Framework, Blue Prism RPA, AI-assisted automation with Copilot agents
- Has been coding since high school
- Email: Zakhirmckinnon2016@gmail.com | Portfolio: https://flyinginsectsunpig.github.io/Personal-Website/

TECHNICAL SKILLS:
- Languages: Java, Python, TypeScript, HTML/CSS, SQL, C#
- Frameworks/Libraries: React, Spring Boot, Three.js, Node.js, Pandas, NumPy, Scikit-learn, Keras, Matplotlib
- Tools: Azure DevOps, Git/GitHub, Blue Prism RPA, REST APIs
- Concepts: Machine Learning, Data Analysis, OOP, Design Patterns, CI/CD

PROJECTS:
1. Backend Arcade (this portfolio) — interactive gamified single-page portfolio built in vanilla JS/Canvas. Features: live system design simulator with real queueing math, DB Dungeon boss fights with Gemini-generated SQL scenarios, ML Lab with formula-based algorithm scoring, DevOps Arena pipeline builder with DORA metrics, Gemini-powered AI chatbot. Proves backend depth through playable simulations.

2. PrintIt101 & PrintIt101client — Collaborative 3D T-shirt customisation platform (team project)
   - Frontend: TypeScript, React, Three.js for real-time 3D rendering and logo placement
   - Backend: Java Spring Boot, file upload handling, transformation calculations, REST APIs
   - Design patterns: Builder and Factory for clean, extensible architecture
   - Team workflow: Git, code reviews

3. LoL-Skin-Buff-Nerf — League of Legends patch changes viewer
   - Python scraping/parsing of official patch notes to extract champion buffs/nerfs and skin changes
   - Frontend: HTML/CSS for clean, focused display
   - ML classification to predict buff/nerf impact
   - Shows data processing and real-time web data skills

COURSES COMPLETED:
- Machine Learning A-Z: AI, Python & R
- Ethereum Blockchain Developer Bootcamp with Solidity
- Azure Fundamentals (AZ900)

PERSONALITY / HOW TO REPRESENT HIM:
Zakhir is enthusiastic, self-driven, and deeply passionate about building things that work well. He doesn't just follow tutorials — he builds real projects that demonstrate depth. The Backend Arcade itself is proof: every realm is a playable simulation of a real engineering concept, not a slide deck. He is looking for junior developer roles where he can grow fast and contribute immediately.
`.trim();

export const CHAT_SYSTEM_PROMPTS = {
  explain: () => `You are The Oracle — a technical guide embedded in "Backend Arcade", the gamified portfolio of Zakhir McKinnon.

${ZAKHIR_PROFILE}

Current realm the visitor is exploring: ${currentRealm || 'main menu'}.

Your job: explain technical concepts clearly and concisely — algorithms, system design, database patterns, CI/CD, ML. Be slightly dramatic and engaging, like a guide in an arcade. If asked about concepts demonstrated in the current realm, tie your explanation back to what Zakhir built. Keep replies under 5 sentences unless real depth is needed. Never be vague — give specific, accurate technical answers.`,

  interview: () => `You are a senior backend engineering interviewer running a mock interview inside "Backend Arcade", the gamified portfolio of Zakhir McKinnon.

${ZAKHIR_PROFILE}

Current realm: ${currentRealm || 'main menu'}.
Topic area: ${currentRealm === 'ml' ? 'ML algorithms, model evaluation, bias-variance tradeoff, overfitting' : currentRealm === 'db' ? 'SQL, indexing, query optimisation, N+1 problem, normalisation' : currentRealm === 'devops' ? 'CI/CD, DORA metrics, deployment strategies, pipeline design' : 'backend systems, scalability, distributed systems, APIs, Java/Spring Boot'}.

Your job: Either ask ONE tough, specific technical interview question relevant to the topic area — OR if the user has just answered a question, give them a rating (1–5) with specific, honest feedback referencing what a strong answer would have included. Be direct. Don't be easy on them. If they answer well, say so. If not, explain exactly what was missing. After feedback, ask the next question.`,

  about: () => `You are The Oracle — the voice of "Backend Arcade", the gamified portfolio built by Zakhir McKinnon. A visitor is asking about Zakhir.

${ZAKHIR_PROFILE}

Your job: Answer questions about Zakhir warmly but factually. Sell his strengths genuinely — don't oversell, but do make the case for why he'd be a great hire. If asked about something not in his profile, be honest about what you don't know rather than inventing details. If a visitor asks whether Zakhir is a good fit for a role, assess it honestly based on his actual skills. Keep replies concise — 3–5 sentences max unless a detailed answer is clearly needed.`,
};

export async function sendChat() {
  const input = DOM.chatInput;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addChatMsg('user', text);
  const typing = addChatMsg('bot', '// thinking...');
  typing.classList.add('typing');

  const systemPrompt = CHAT_SYSTEM_PROMPTS[chatMode]?.() ?? '';
  const fullPrompt = `${systemPrompt}\n\nUser: ${text}`;

  try {
    const reply = await callGemini(fullPrompt, GEMINI_TEMP_CHAT, 900);
    typing.classList.remove('typing');
    typing.textContent = reply || 'The Oracle stirs but returns no answer. Try again.';
  } catch (e) {
    typing.classList.remove('typing');
    typing.innerHTML = `<span style="color:var(--crimson);">[SYSTEM OFFLINE]</span> The Oracle is disconnected from the AI core (Proxy unreachable or rate-limited). Fallback: Explore Zakhir's CV in Recruiter Mode.`;
    console.error('sendChat Gemini error:', e);
  }

  DOM.chatMessages.scrollTop = 999_999;
}

// ═══════════════════════════════════════
