import { visibility, dateRange, monthYear, listSummary, thumbnail, titleWithSub } from '../crud/cells.js';
import { sortOrderField, visibleField } from './common.js';

export const certifications = {
    id: 'certifications',
    title: 'Certifications',
    singular: 'certification',
    description: 'Certificate image, issuer, dates and what you learned.',
    endpoint: '/api/certifications',
    itemName: (item) => item.title,
    fields: [
        { name: 'title', label: 'Certificate title', required: true, maxLength: 200 },
        { name: 'issuer', label: 'Issued by', required: true, maxLength: 150 },
        { name: 'startDate', label: 'Course start', type: 'date', hint: 'Optional — for courses with a duration.' },
        { name: 'issueDate', label: 'Completed / issued', type: 'date' },
        { name: 'hours', label: 'Hours', type: 'number', min: 0, max: 10000 },
        sortOrderField,
        { name: 'imageUrl', label: 'Certificate image', type: 'file', accept: 'image/png,image/jpeg,image/webp', wide: true },
        { name: 'credentialUrl', label: 'Verification link', type: 'url', wide: true, placeholder: 'https://coursera.org/verify/…' },
        { name: 'description', label: 'Short description', type: 'textarea', maxLength: 2000, wide: true },
        { name: 'learnedTopics', label: 'What you learned', type: 'list', wide: true, rows: 6 },
        { name: 'skills', label: 'Skills', type: 'list', wide: true },
        visibleField
    ],
    columns: [
        { label: '', render: (item) => thumbnail(item.imageUrl) },
        { label: 'Certificate', render: (item) => titleWithSub(item.title, item.issuer) },
        { label: 'Dates', render: (item) => item.startDate ? dateRange(item.startDate, item.issueDate) : (monthYear(item.issueDate) ?? '—') },
        { label: 'Learned', render: (item) => listSummary(item.learnedTopics, 2) },
        { label: 'Status', render: visibility }
    ]
};
