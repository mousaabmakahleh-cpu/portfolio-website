import { el, icon } from '../core/dom.js';
import { dateRange, duration } from '../core/format.js';

const TYPE_ICONS = {
    Job: 'briefcase',
    Internship: 'briefcase',
    Course: 'book',
    Training: 'award',
    Volunteer: 'globe'
};

/**
 * One entry on the experience timeline.
 * @param {{ title: string, organization: string, type: string, location?: string, startDate: string,
 *           endDate?: string, description?: string, highlights: string[], skills: string[] }} item
 */
export function createExperienceItem(item) {
    const isCurrent = !item.endDate;
    const length = duration(item.startDate, item.endDate);

    return el('li', { class: 'timeline__item reveal' }, [
        el('span', { class: `timeline__dot${isCurrent ? ' timeline__dot--live' : ''}` }, [icon(TYPE_ICONS[item.type] ?? 'briefcase')]),
        el('article', { class: 'timeline__card card spotlight' }, [
            el('header', { class: 'timeline__head' }, [
                el('span', { class: `type-badge type-badge--${item.type}`, text: item.type }),
                el('span', { class: 'timeline__dates' }, [
                    icon('calendar'),
                    dateRange(item.startDate, item.endDate),
                    length ? el('span', { class: 'timeline__duration', text: ` · ${length}` }) : null
                ])
            ]),
            el('h3', { class: 'timeline__title', text: item.title }),
            el('p', { class: 'timeline__org' }, [
                el('strong', { text: item.organization }),
                item.location ? el('span', { class: 'muted', text: ` · ${item.location}` }) : null
            ]),
            item.description ? el('p', { class: 'timeline__desc', text: item.description }) : null,
            item.highlights?.length
                ? el('ul', { class: 'checklist' }, item.highlights.map(text => el('li', {}, [icon('check'), el('span', { text })])))
                : null,
            item.skills?.length
                ? el('div', { class: 'timeline__skills' }, [
                    el('span', { class: 'mini-label', text: 'Skills' }),
                    el('ul', { class: 'tags' }, item.skills.map(skill => el('li', { class: 'tag tag--accent', text: skill })))
                ])
                : null
        ])
    ]);
}
