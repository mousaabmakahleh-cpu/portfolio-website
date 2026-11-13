import { visibility, dateRange, listSummary, titleWithSub } from '../crud/cells.js';
import { sortOrderField, visibleField } from './common.js';

export const education = {
    id: 'education',
    title: 'Education',
    singular: 'education entry',
    description: 'University, degree, GPA and the subjects you want to highlight.',
    endpoint: '/api/education',
    itemName: (item) => item.institution,
    fields: [
        { name: 'institution', label: 'University / institution', required: true, maxLength: 150 },
        { name: 'degree', label: 'Degree', required: true, maxLength: 150, placeholder: 'Bachelor of Science' },
        { name: 'fieldOfStudy', label: 'Major / field of study', maxLength: 150, placeholder: 'Software Engineering' },
        { name: 'location', label: 'Location', maxLength: 100, placeholder: 'Irbid, Jordan' },
        { name: 'startDate', label: 'Start date', type: 'date' },
        { name: 'endDate', label: 'End date', type: 'date', hint: 'Leave empty if you are still studying.' },
        { name: 'gpa', label: 'GPA', maxLength: 30, placeholder: '3.5 / 4.0' },
        sortOrderField,
        { name: 'description', label: 'Short description', type: 'textarea', maxLength: 2000, wide: true },
        { name: 'subjects', label: 'Key subjects', type: 'list', wide: true, rows: 6 },
        visibleField
    ],
    columns: [
        { label: 'Institution', render: (item) => titleWithSub(item.institution, [item.degree, item.fieldOfStudy].filter(Boolean).join(' · ')) },
        { label: 'Dates', render: (item) => dateRange(item.startDate, item.endDate) },
        { label: 'GPA', render: (item) => item.gpa || '—' },
        { label: 'Subjects', render: (item) => listSummary(item.subjects) },
        { label: 'Status', render: visibility }
    ]
};
