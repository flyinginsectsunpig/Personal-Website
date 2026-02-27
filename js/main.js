import * as CONSTANTS from './config/constants.js';
import { DOM, setText, setMetricDisplay, callGemini } from './config/dom.js';

import { animateCursor } from './effects/cursor.js';
import { createParticles } from './effects/particles.js';
import { toast } from './ui/toast.js';
import { initWebGLBackground } from './effects/webgl-bg.js';
import { initHoloCards } from './effects/cards.js';

import { enterArcade, backToCards } from './core/screen.js';
import { enterRealm, launchRealm } from './effects/warp.js';
import './core/shortcuts.js'; // Imports run the addEventListener
import './effects/scroll.js'; // Imports run the IntersectionObserver

import { initSystemRealm, clearConnecting, clearNodes, sysNodeDragStart, sysNodeDrop, selectNode, updateTraffic, triggerEvent } from './realms/system.js';
import { initDBRealm, attemptSolution, renderDBLevel } from './realms/database.js';
import { initDevOps, runPipeline, clearPipeline, onPlacedDragStart, onPlacedDragEnd, onPlacedDragOver, onPlacedDrop, removePipelineStage } from './realms/devops.js';
import { initHireRealm, setHireMode, openCodeDrawer, closeCodeDrawer, switchCodeTab } from './realms/hire.js';
import { switchBackendLang, executeBackend, sendMockRequest, clearTerminal } from './realms/backend.js';
import { openProjectCode, switchProjectCodeTab } from './realms/projects.js';

import { toggleChat, setChatMode, sendChat } from './chat/oracle.js';

// Re-expose necessary functions to the window object so inline HTML onclick handlers work
window.enterArcade = enterArcade;
window.backToCards = backToCards;
window.enterRealm = enterRealm;
window.launchRealm = launchRealm;

window.initSystemRealm = initSystemRealm;
window.clearConnecting = clearConnecting;
window.clearNodes = clearNodes;
window.sysNodeDragStart = sysNodeDragStart;
window.sysNodeDrop = sysNodeDrop;
window.selectNode = selectNode;
window.updateTraffic = updateTraffic;
window.triggerEvent = triggerEvent;

window.initDBRealm = initDBRealm;
window.attemptSolution = attemptSolution;
window.renderDBLevel = renderDBLevel;
window.initDevOps = initDevOps;
window.runPipeline = runPipeline;
window.clearPipeline = clearPipeline;
window.onPlacedDragStart = onPlacedDragStart;
window.onPlacedDragEnd = onPlacedDragEnd;
window.onPlacedDragOver = onPlacedDragOver;
window.onPlacedDrop = onPlacedDrop;
window.removePipelineStage = removePipelineStage;
window.initHireRealm = initHireRealm;
window.setHireMode = setHireMode;

window.switchBackendLang = switchBackendLang;
window.executeBackend = executeBackend;
window.sendMockRequest = sendMockRequest;
window.clearTerminal = clearTerminal;
window.openCodeDrawer = openCodeDrawer;
window.closeCodeDrawer = closeCodeDrawer;
window.switchCodeTab = switchCodeTab;

window.openProjectCode = openProjectCode;
window.switchProjectCodeTab = switchProjectCodeTab;

window.toggleChat = toggleChat;
window.setChatMode = setChatMode;
window.sendChat = sendChat;

window.toast = toast;
window.callGemini = callGemini;
window.createParticles = createParticles;
window.initWebGLBackground = initWebGLBackground;
window.initHoloCards = initHoloCards;

console.log("Modules loaded and bound to window.");
