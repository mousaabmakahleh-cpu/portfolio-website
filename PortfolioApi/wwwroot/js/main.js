/**
 * Entry point — composes the independent modules. Each module owns exactly one concern.
 */
import { initTheme } from './features/theme.js';
import { initNavigation } from './features/navigation.js';
import { initScrollProgress } from './features/scroll-progress.js';
import { initTypewriter } from './features/typewriter.js';
import { observeReveal } from './features/reveal.js';
import { initSpotlight } from './features/spotlight.js';
import { initMarquee } from './features/marquee.js';
import { animateCount } from './features/counter.js';
import { recordVisit } from './features/visits.js';
import { renderProjects } from './sections/projects.js';
import { renderSkills } from './sections/skills.js';
import { initContactForm } from './sections/contact.js';

const ROLES = [
    'Full-Stack Software Engineer',
    'C# & .NET Backend Developer',
    'Frontend & UI Engineer',
    'PostgreSQL Data Modeler'
];

function initStaticUi() {
    initTheme();
    initNavigation();
    initScrollProgress();
    initMarquee();
    initSpotlight();
    initTypewriter(document.getElementById('typewriter'), ROLES);
    initContactForm();
    observeReveal();

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
}

async function loadContent() {
    const [projects, skills] = await Promise.all([renderProjects(), renderSkills()]);
    animateCount(document.querySelector('[data-counter="projects"]'), projects);
    animateCount(document.querySelector('[data-counter="skills"]'), skills);
}

initStaticUi();
loadContent();
recordVisit();
