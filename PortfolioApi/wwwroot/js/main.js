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
import { initLightbox } from './features/lightbox.js';
import { animateCount } from './features/counter.js';
import { recordVisit } from './features/visits.js';
import { renderProfile } from './sections/profile.js';
import { renderEducation } from './sections/education.js';
import { renderExperience } from './sections/experience.js';
import { renderSkills } from './sections/skills.js';
import { renderProjects } from './sections/projects.js';
import { renderCertifications } from './sections/certifications.js';
import { initContactForm } from './sections/contact.js';

// The first entry must match the text already in #typewriter (index.html)
const ROLES = [
    'Backend & Full-Stack Developer',
    'C# & ASP.NET Core Engineer',
    'REST API Developer',
    'PostgreSQL & EF Core Developer'
];

function initStaticUi() {
    initTheme();
    initNavigation();
    initScrollProgress();
    initMarquee();
    initSpotlight();
    initLightbox();
    initTypewriter(document.getElementById('typewriter'), ROLES);
    initContactForm();
    observeReveal();

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
}

async function loadContent() {
    const [, , , skills, projects, certifications] = await Promise.all([
        renderProfile(),
        renderEducation(),
        renderExperience(),
        renderSkills(),
        renderProjects(),
        renderCertifications()
    ]);

    animateCount(document.querySelector('[data-counter="projects"]'), projects);
    animateCount(document.querySelector('[data-counter="skills"]'), skills);
    animateCount(document.querySelector('[data-counter="certifications"]'), certifications);
}

initStaticUi();
loadContent();
recordVisit();
