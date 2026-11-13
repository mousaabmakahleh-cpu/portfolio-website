const TOKEN_KEY = 'admin-token';

function getToken() {
    try {
        return sessionStorage.getItem(TOKEN_KEY);
    } catch (error) {
        return null;
    }
}

function setToken(token) {
    try {
        sessionStorage.setItem(TOKEN_KEY, token);
    } catch (error) { }
}

function clearToken() {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
    } catch (error) { }
}


async function authFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': 'Bearer ' + getToken()
        }
    });

    if (response.status === 401) {
        clearToken();
        showView(false);
        throw new Error('Session expired');
    }

    return response;
}

function messageRow(body, text, columns = 4) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columns;
    cell.textContent = text;
    row.append(cell);
    body.append(row);
}


async function loadAdminProjects() {
    const body = document.getElementById('projects-body');
    body.textContent = '';

    try {
        const response = await authFetch('/api/projects/all');
        if (!response.ok) throw new Error('Request failed');

        const projects = await response.json();

        if (projects.length === 0) {
            messageRow(body, 'No projects yet.');
            return;
        }

        projects.forEach(project => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = project.name;

            const statusCell = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge ' + (project.isActive ? 'badge-on' : 'badge-off');
            badge.textContent = project.isActive ? 'Visible' : 'Hidden';
            statusCell.append(badge);

            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(project.createdAt).toLocaleDateString('en-GB');

            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'table-button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => openProjectForm(project));
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'table-button danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteProject(project));

            actionsCell.append(editButton, deleteButton);

            row.append(nameCell, statusCell, dateCell, actionsCell);
            body.append(row);
        });
    } catch (error) {
        messageRow(body, 'Could not load projects.');
    }
}

let editingId = null;

function openProjectForm(project) {
    const form = document.getElementById('project-form');

    editingId = project ? project.id : null;

    document.getElementById('project-form-title').textContent = project ? 'Edit project' : 'New project';
    document.getElementById('project-name').value = project ? project.name : '';
    document.getElementById('project-description').value = project ? project.description : '';
    document.getElementById('project-image').value = project && project.imageUrl ? project.imageUrl : '';
    document.getElementById('project-link').value = project && project.projectUrl ? project.projectUrl : '';
    document.getElementById('project-active').checked = project ? project.isActive : true;
    document.getElementById('project-form-status').textContent = '';

    document.getElementById('project-active-label').hidden = !project;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('project-name').focus();
}

function closeProjectForm() {
    document.getElementById('project-form').hidden = true;
    editingId = null;
}
async function deleteProject(project) {
    if (!confirm('Delete "' + project.name + '" permanently? This cannot be undone.')) return;

    try {
        const response = await authFetch('/api/projects/' + project.id, { method: 'DELETE' });

        if (response.ok || response.status === 404) {
            if (editingId === project.id) closeProjectForm();
            await loadAdminProjects();
        } else {
            alert('Could not delete the project.');
        }
    } catch (error) {
        alert('Could not delete the project.');
    }
}

document.getElementById('add-project-button').addEventListener('click', () => openProjectForm(null));
document.getElementById('project-cancel').addEventListener('click', closeProjectForm);

document.getElementById('project-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = document.getElementById('project-form-status');
    const saveButton = event.target.querySelector('button[type="submit"]');

    const imageUrl = document.getElementById('project-image').value.trim();
    const projectUrl = document.getElementById('project-link').value.trim();

    const payload = {
        name: document.getElementById('project-name').value.trim(),
        description: document.getElementById('project-description').value.trim(),
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null
    };

    const isEdit = editingId !== null;
    if (isEdit) payload.isActive = document.getElementById('project-active').checked;

    saveButton.disabled = true;
    status.textContent = 'Saving...';

    try {
        const response = await authFetch(isEdit ? '/api/projects/' + editingId : '/api/projects', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            closeProjectForm();
            await loadAdminProjects();
        } else if (response.status === 400) {
            status.textContent = 'Please check the fields and try again.';
        } else {
            status.textContent = 'Something went wrong. Try again.';
        }
    } catch (error) {
        status.textContent = 'Could not save the project.';
    } finally {
        saveButton.disabled = false;
    }
});

function showView(loggedIn) {
    document.getElementById('login-view').hidden = loggedIn;
    document.getElementById('dashboard-view').hidden = !loggedIn;

    if (loggedIn) {
        loadStats();
        loadAdminProjects();
        loadAdminSkills();
        loadAdminMessages();
    }
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const status = document.getElementById('login-status');
    const button = form.querySelector('button');

    button.disabled = true;
    status.textContent = 'Signing in...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('login-username').value.trim(),
                password: document.getElementById('login-password').value
            })
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.token);
            form.reset();
            status.textContent = '';
            showView(true);
        } else if (response.status === 401) {
            status.textContent = 'Invalid username or password.';
        } else {
            status.textContent = 'Something went wrong. Try again.';
        }
    } catch (error) {
        status.textContent = 'Cannot reach the server.';
    } finally {
        button.disabled = false;
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    clearToken();
    showView(false);
});

function textCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

let editingSkillId = null;

async function loadAdminSkills() {
    const body = document.getElementById('skills-body');
    body.textContent = '';

    try {
        const response = await authFetch('/api/skills/all');
        if (!response.ok) throw new Error('Request failed');

        const skills = await response.json();

        if (skills.length === 0) {
            messageRow(body, 'No skills yet.', 5);
            return;
        }

        skills.forEach(skill => {
            const row = document.createElement('tr');

            const statusCell = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge ' + (skill.isActive ? 'badge-on' : 'badge-off');
            badge.textContent = skill.isActive ? 'Visible' : 'Hidden';
            statusCell.append(badge);

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'table-button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => openSkillForm(skill));

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'table-button danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteSkill(skill));

            actionsCell.append(editButton, deleteButton);

            row.append(
                textCell(skill.name),
                textCell(skill.category),
                textCell(Number(skill.level) + '%'),
                statusCell,
                actionsCell
            );
            body.append(row);
        });
    } catch (error) {
        messageRow(body, 'Could not load skills.', 5);
    }
}

function openSkillForm(skill) {
    const form = document.getElementById('skill-form');

    editingSkillId = skill ? skill.id : null;

    document.getElementById('skill-form-title').textContent = skill ? 'Edit skill' : 'New skill';
    document.getElementById('skill-name').value = skill ? skill.name : '';
    document.getElementById('skill-category').value = skill ? skill.category : '';
    document.getElementById('skill-level').value = skill ? skill.level : 70;
    document.getElementById('skill-level-value').textContent = skill ? skill.level : 70;
    document.getElementById('skill-active').checked = skill ? skill.isActive : true;
    document.getElementById('skill-form-status').textContent = '';

    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('skill-name').focus();
}

function closeSkillForm() {
    document.getElementById('skill-form').hidden = true;
    editingSkillId = null;
}

async function deleteSkill(skill) {
    if (!confirm('Delete "' + skill.name + '" permanently? This cannot be undone.')) return;

    try {
        const response = await authFetch('/api/skills/' + skill.id, { method: 'DELETE' });

        if (response.ok || response.status === 404) {
            if (editingSkillId === skill.id) closeSkillForm();
            await loadAdminSkills();
        } else {
            alert('Could not delete the skill.');
        }
    } catch (error) {
        alert('Could not delete the skill.');
    }
}

document.getElementById('add-skill-button').addEventListener('click', () => openSkillForm(null));
document.getElementById('skill-cancel').addEventListener('click', closeSkillForm);

document.getElementById('skill-level').addEventListener('input', (event) => {
    document.getElementById('skill-level-value').textContent = event.target.value;
});

document.getElementById('skill-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = document.getElementById('skill-form-status');
    const saveButton = event.target.querySelector('button[type="submit"]');

    const payload = {
        name: document.getElementById('skill-name').value.trim(),
        category: document.getElementById('skill-category').value.trim(),
        level: Number(document.getElementById('skill-level').value),
        isActive: document.getElementById('skill-active').checked
    };

    const isEdit = editingSkillId !== null;

    saveButton.disabled = true;
    status.textContent = 'Saving...';

    try {
        const response = await authFetch(isEdit ? '/api/skills/' + editingSkillId : '/api/skills', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            closeSkillForm();
            await loadAdminSkills();
        } else if (response.status === 400) {
            status.textContent = 'Please check the fields and try again.';
        } else {
            status.textContent = 'Something went wrong. Try again.';
        }
    } catch (error) {
        status.textContent = 'Could not save the skill.';
    } finally {
        saveButton.disabled = false;
    }
});

async function loadStats() {
    try {
        const response = await authFetch('/api/visits/stats');
        if (!response.ok) throw new Error('Request failed');

        const stats = await response.json();
        document.getElementById('stat-total').textContent = Number(stats.total);
        document.getElementById('stat-today').textContent = Number(stats.today);
        document.getElementById('stat-week').textContent = Number(stats.lastWeek);
    } catch (error) {
        ['stat-total', 'stat-today', 'stat-week'].forEach(id => {
            document.getElementById(id).textContent = '–';
        });
    }
}

async function loadAdminMessages() {
    const list = document.getElementById('messages-list');
    list.textContent = '';

    try {
        const response = await authFetch('/api/messages');
        if (!response.ok) throw new Error('Request failed');

        const messages = await response.json();

        document.getElementById('stat-unread').textContent = messages.filter(m => !m.isRead).length;

        if (messages.length === 0) {
            list.textContent = 'No messages yet.';
            return;
        }

        messages.forEach(message => {
            const card = document.createElement('article');
            card.className = 'message-card' + (message.isRead ? '' : ' unread');

            const head = document.createElement('div');
            head.className = 'message-head';

            const sender = document.createElement('strong');
            sender.textContent = message.name;

            const date = document.createElement('span');
            date.className = 'message-meta';
            date.textContent = new Date(message.createdAt).toLocaleString('en-GB');

            head.append(sender, date);

            const email = document.createElement('a');
            email.className = 'message-meta';
            email.href = 'mailto:' + encodeURIComponent(message.email);
            email.textContent = message.email;

            const content = document.createElement('p');
            content.className = 'message-content';
            content.textContent = message.content;

            const actions = document.createElement('div');
            actions.className = 'message-actions';

            if (!message.isRead) {
                const readButton = document.createElement('button');
                readButton.type = 'button';
                readButton.className = 'table-button';
                readButton.textContent = 'Mark as read';
                readButton.addEventListener('click', () => markMessageRead(message));
                actions.append(readButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'table-button danger';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteMessage(message));
            actions.append(deleteButton);

            card.append(head, email, content, actions);
            list.append(card);
        });
    } catch (error) {
        list.textContent = 'Could not load messages.';
    }
}

async function markMessageRead(message) {
    try {
        const response = await authFetch('/api/messages/' + message.id + '/read', { method: 'PUT' });

        if (response.ok || response.status === 404) {
            await loadAdminMessages();
        } else {
            alert('Could not update the message.');
        }
    } catch (error) {
        alert('Could not update the message.');
    }
}

async function deleteMessage(message) {
    if (!confirm('Delete this message from ' + message.name + ' permanently?')) return;

    try {
        const response = await authFetch('/api/messages/' + message.id, { method: 'DELETE' });

        if (response.ok || response.status === 404) {
            await loadAdminMessages();
        } else {
            alert('Could not delete the message.');
        }
    } catch (error) {
        alert('Could not delete the message.');
    }
}

showView(Boolean(getToken()));