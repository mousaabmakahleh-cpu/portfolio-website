async function loadProjects() {
    const container = document.getElementById('projects-list');

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Request failed');

        const projects = await response.json();

        if (projects.length === 0) {
            container.textContent = 'لا يوجد مشاريع حالياً.';
            return;
        }

        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'card';

            const title = document.createElement('h3');
            title.textContent = project.name;

            const description = document.createElement('p');
            description.textContent = project.description;

            const date = document.createElement('small');
            date.textContent = new Date(project.createdAt).toLocaleDateString('ar-JO');

            card.append(title, description, date);

            if (project.projectUrl && project.projectUrl.startsWith('http')) {
                const link = document.createElement('a');
                link.href = project.projectUrl;
                link.textContent = 'عرض المشروع';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                card.append(link);
            }

            container.append(card);
        });
    } catch (error) {
        container.textContent = 'تعذر تحميل المشاريع.';
    }
}
async function loadSkills() {
    const container = document.getElementById('skills-list');

    try {
        const response = await fetch('/api/skills');
        if (!response.ok) throw new Error('Request failed');

        const skills = await response.json();

        if (skills.length === 0) {
            container.textContent = 'لا يوجد مهارات حالياً.';
            return;
        }

        const groups = {};
        skills.forEach(skill => {
            if (!groups[skill.category]) groups[skill.category] = [];
            groups[skill.category].push(skill);
        });

        Object.entries(groups).forEach(([category, items]) => {
            const group = document.createElement('div');
            group.className = 'skill-group';

            const heading = document.createElement('h3');
            heading.textContent = category;
            group.append(heading);

            items.forEach(skill => {
                const row = document.createElement('div');
                row.className = 'skill';

                const label = document.createElement('div');
                label.className = 'skill-label';

                const name = document.createElement('span');
                name.textContent = skill.name;

                const level = document.createElement('span');
                level.textContent = Number(skill.level) + '%';

                label.append(name, level);

                const bar = document.createElement('div');
                bar.className = 'skill-bar';

                const fill = document.createElement('div');
                fill.className = 'skill-fill';
                fill.style.width = Number(skill.level) + '%';

                bar.append(fill);
                row.append(label, bar);
                group.append(row);
            });

            container.append(group);
        });
    } catch (error) {
        container.textContent = 'تعذر تحميل المهارات.';
    }
}
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const button = form.querySelector('button');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        button.disabled = true;
        status.textContent = 'جاري الإرسال...';

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('contact-name').value.trim(),
                    email: document.getElementById('contact-email').value.trim(),
                    content: document.getElementById('contact-content').value.trim()
                })
            });

            if (response.ok) {
                form.reset();
                status.textContent = 'تم إرسال رسالتك، شكراً لك!';
            } else if (response.status === 400) {
                status.textContent = 'تأكد من تعبئة الحقول بشكل صحيح.';
            } else {
                status.textContent = 'حدث خطأ، حاول مرة أخرى لاحقاً.';
            }
        } catch (error) {
            status.textContent = 'تعذر الاتصال بالسيرفر.';
        } finally {
            button.disabled = false;
        }
    });
}
function setupThemeToggle() {
    const button = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function applyTheme(theme) {
        root.dataset.theme = theme;
        button.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    let saved = null;
    try {
        saved = localStorage.getItem('theme');
    } catch (error) { }

    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));

    button.addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (error) { }
    });
}
function recordVisit() {
    try {
        if (sessionStorage.getItem('visit-recorded')) return;
    } catch (error) { }

    fetch('/api/visits', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                try {
                    sessionStorage.setItem('visit-recorded', '1');
                } catch (error) { }
            }
        })
        .catch(() => { });
}

loadProjects();
loadSkills();
setupContactForm();
setupThemeToggle();
recordVisit();