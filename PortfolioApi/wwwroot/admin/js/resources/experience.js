import { visibility, dateRange, listSummary, titleWithSub } from '../crud/cells.js';
import { sortOrderField, visibleField } from './common.js';

export const EXPERIENCE_TYPES = ['Job', 'Internship', 'Course', 'Training', 'Volunteer'];

export const experience = {
    id: 'experience',
    title: 'Experience',
    singular: 'experience entry',
    description: 'Jobs, internships, courses and trainings — with dates and the skills you used.',
    endpoint: '/api/experience',
    itemName: (item) => item.title,
    fields: [
        { name: 'title', label: 'Title', required: true, maxLength: 150, placeholder: 'Backend Developer Trainee' },
        { name: 'organization', label: 'Organization', required: true, maxLength: 150 },
        { name: 'type', label: 'Type', type: 'select', options: EXPERIENCE_TYPES.map(value => ({ value, label: value })), default: 'Course' },
        { name: 'location', label: 'Location', maxLength: 100, placeholder: 'Amman, Jordan · Remote' },
        { name: 'startDate', label: 'From', type: 'date', required: true },
        { name: 'endDate', label: 'To', type: 'date', hint: 'Leave empty if it is ongoing.' },
        sortOrderField,
        { name: 'description', label: 'Summary', type: 'textarea', maxLength: 2000, wide: true },
        { name: 'highlights', label: 'What you did / learned', type: 'list', wide: true },
        { name: 'skills', label: 'Skills used', type: 'list', wide: true, hint: 'One skill per line, e.g. C#, ASP.NET Core, PostgreSQL.' },
        visibleField
    ],
    columns: [
        { label: 'Title', render: (item) => titleWithSub(item.title, item.organization) },
        { label: 'Type', render: (item) => item.type },
        { label: 'Dates', render: (item) => dateRange(item.startDate, item.endDate) },
        { label: 'Skills', render: (item) => listSummary(item.skills) },
        { label: 'Status', render: visibility }
    ]
};
