import { el } from '../../../js/core/dom.js';
import { visibility, listSummary, thumbnail, titleWithSub } from '../crud/cells.js';
import { sortOrderField, visibleField } from './common.js';

export const PROJECT_STATUSES = [
    { value: 'Completed', label: 'Completed' },
    { value: 'InProgress', label: 'In progress' },
    { value: 'Planned', label: 'Planned' }
];

const statusLabel = (value) => PROJECT_STATUSES.find(s => s.value === value)?.label ?? value;

export const projects = {
    id: 'projects',
    title: 'Projects',
    singular: 'project',
    description: 'Screenshot, status, features, technologies and repository links.',
    endpoint: '/api/projects',
    itemName: (item) => item.name,
    fields: [
        { name: 'name', label: 'Name', required: true, maxLength: 100 },
        { name: 'status', label: 'Status', type: 'select', options: PROJECT_STATUSES, default: 'Completed' },
        { name: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 4000, wide: true },
        { name: 'imageUrl', label: 'Screenshot of the home page', type: 'file', accept: 'image/png,image/jpeg,image/webp', wide: true,
          hint: 'Best at 16:10 (e.g. 1600×1000). JPG, PNG or WebP up to 10 MB.' },
        { name: 'features', label: 'Features', type: 'list', wide: true, rows: 7 },
        { name: 'technologies', label: 'Technologies', type: 'list', wide: true, hint: 'One per line, e.g. ASP.NET Core, PostgreSQL, JWT.' },
        { name: 'frontendRepoUrl', label: 'Frontend repository', type: 'url', placeholder: 'https://github.com/…' },
        { name: 'backendRepoUrl', label: 'Backend repository', type: 'url', placeholder: 'https://github.com/…' },
        { name: 'projectUrl', label: 'Live demo / main link', type: 'url', placeholder: 'https://…' },
        sortOrderField,
        visibleField
    ],
    columns: [
        { label: '', render: (item) => thumbnail(item.imageUrl) },
        { label: 'Project', render: (item) => titleWithSub(item.name, listSummary(item.technologies)) },
        { label: 'Status', render: (item) => el('span', { class: `pill pill--${item.status}`, text: statusLabel(item.status) }) },
        { label: 'Features', render: (item) => String(item.features?.length ?? 0) },
        { label: 'Visible', render: visibility }
    ]
};
