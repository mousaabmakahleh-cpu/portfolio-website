import { visibility } from '../crud/cells.js';
import { visibleField } from './common.js';

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'UI/UX', 'Tools'];

export const skills = {
    id: 'skills',
    title: 'Skills',
    singular: 'skill',
    description: 'Shown on the site grouped by category: Frontend, Backend, Database, UI/UX and Tools.',
    endpoint: '/api/skills',
    itemName: (item) => item.name,
    fields: [
        { name: 'name', label: 'Skill', required: true, maxLength: 50 },
        { name: 'category', label: 'Category', type: 'select', options: SKILL_CATEGORIES.map(value => ({ value, label: value })), default: 'Frontend' },
        { name: 'level', label: 'Level', type: 'range', min: 0, max: 100, default: 70, wide: true },
        visibleField
    ],
    columns: [
        { label: 'Skill', render: (item) => item.name },
        { label: 'Category', render: (item) => item.category },
        { label: 'Level', render: (item) => `${Number(item.level)}%` },
        { label: 'Status', render: visibility }
    ]
};
