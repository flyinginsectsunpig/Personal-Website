import { preprocess } from './modules/preprocess.js';
import { regression } from './modules/regression.js';
import { classification } from './modules/classification.js';
import { clustering } from './modules/clustering.js';
import { association } from './modules/association.js';
import { rl } from './modules/rl.js';
import { nlp } from './modules/nlp.js';
import { deeplearn } from './modules/deeplearn.js';
import { dimreduce } from './modules/dimreduce.js';
import { boosting } from './modules/boosting.js';
import { registerModules, buildSidebar } from './core/ui.js';

const MODULEMAP = {
    preprocess,
    regression,
    classification,
    clustering,
    association,
    rl,
    nlp,
    deeplearn,
    dimreduce,
    boosting
};

window.addEventListener('DOMContentLoaded', () => {
    registerModules(MODULEMAP);
    buildSidebar();
});
