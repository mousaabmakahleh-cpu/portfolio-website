/**
 * Display formatting for dates, durations and GPA values coming from the API.
 * API dates are ISO "yyyy-MM-dd" (DateOnly) or full ISO timestamps.
 */
const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

export function parseDate(value) {
    if (!value) return null;
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function monthYear(value) {
    const date = parseDate(value);
    return date ? monthFormat.format(date) : null;
}

/** "Aug 2025 – Feb 2026", "Aug 2025 – Present", or a single date when only one is known. */
export function dateRange(start, end, { present = 'Present' } = {}) {
    const from = monthYear(start);
    const to = monthYear(end);
    if (from && to) return from === to ? from : `${from} – ${to}`;
    if (from) return `${from} – ${present}`;
    return to ?? '';
}

/** "2022 – 2026", or "2022 – Present" when there is no end date. */
export function yearRange(start, end, { present = 'Present' } = {}) {
    const from = parseDate(start)?.getFullYear();
    const to = parseDate(end)?.getFullYear();
    if (from && to) return from === to ? String(from) : `${from} – ${to}`;
    if (from) return `${from} – ${present}`;
    return to ? String(to) : '';
}

/** Human duration between two dates, e.g. "1 yr 3 mos". End defaults to today. */
export function duration(start, end) {
    const from = parseDate(start);
    if (!from) return '';
    const to = parseDate(end) ?? new Date();
    let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
    if (months < 1) months = 1;

    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts = [];
    if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`);
    return parts.join(' ');
}

/**
 * Reads "3.6 / 4", "3.6/4.0", "85%", "85 / 100" into { value, scale, ratio }.
 * Returns null for non-numeric grades like "Very Good" (shown as text instead).
 */
export function parseGpa(text) {
    if (!text) return null;
    const match = String(text).match(/(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?)|(%))?/);
    if (!match) return null;

    const value = Number(match[1]);
    const scale = match[3] ? 100 : Number(match[2] ?? (value <= 4 ? 4 : value <= 5 ? 5 : 100));
    if (!scale || value > scale) return null;
    return { value, scale, ratio: value / scale };
}
