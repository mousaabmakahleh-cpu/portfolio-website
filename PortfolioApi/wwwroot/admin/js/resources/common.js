/** Fields shared by every content resource. */
export const sortOrderField = {
    name: 'sortOrder', label: 'Display order', type: 'number', min: 0, max: 1000, default: 0,
    hint: 'Lower numbers appear first. Items with the same number are sorted by date.'
};

export const visibleField = { name: 'isActive', label: 'Visible on the site', type: 'checkbox', default: true, wide: true };
