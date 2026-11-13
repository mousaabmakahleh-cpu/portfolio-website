import { el, icon } from '../core/dom.js';
import { dateRange, monthYear } from '../core/format.js';
import { safeUrl } from '../core/url.js';

/**
 * @param {{ title: string, issuer: string, startDate?: string, issueDate?: string, hours?: number,
 *           imageUrl?: string, credentialUrl?: string, description?: string,
 *           learnedTopics: string[], skills: string[] }} cert
 */
export function createCertificateCard(cert, index) {
    const image = safeUrl(cert.imageUrl);
    const verify = safeUrl(cert.credentialUrl);
    const when = cert.startDate ? dateRange(cert.startDate, cert.issueDate) : monthYear(cert.issueDate);

    const media = image
        ? el('button', {
            class: 'cert__media',
            attrs: {
                type: 'button',
                'data-lightbox': image,
                'data-lightbox-caption': `${cert.title} — ${cert.issuer}`,
                'aria-label': `View certificate: ${cert.title}`
            }
        }, [
            el('img', { attrs: { src: image, alt: '', loading: 'lazy', decoding: 'async' } }),
            el('span', { class: 'cert__zoom' }, [icon('expand'), 'View'])
        ])
        : el('div', { class: 'cert__media cert__media--empty', attrs: { 'aria-hidden': 'true' } }, [icon('award')]);

    return el('article', {
        class: 'cert card spotlight reveal',
        attrs: { 'data-reveal-delay': String(index % 3) }
    }, [
        media,
        el('div', { class: 'cert__body' }, [
            el('p', { class: 'cert__issuer' }, [icon('award'), cert.issuer]),
            el('h3', { class: 'cert__title', text: cert.title }),
            el('div', { class: 'cert__meta' }, [
                when ? el('span', {}, [icon('calendar'), when]) : null,
                cert.hours ? el('span', {}, [icon('clock'), `${cert.hours} hours`]) : null
            ]),
            cert.description ? el('p', { class: 'cert__desc', text: cert.description }) : null,
            cert.learnedTopics?.length
                ? el('div', { class: 'cert__learned' }, [
                    el('span', { class: 'mini-label', text: 'What I learned' }),
                    el('ul', { class: 'checklist checklist--compact' },
                        cert.learnedTopics.map(text => el('li', {}, [icon('check'), el('span', { text })])))
                ])
                : null,
            cert.skills?.length
                ? el('ul', { class: 'tags' }, cert.skills.map(skill => el('li', { class: 'tag', text: skill })))
                : null,
            verify
                ? el('a', { class: 'text-link', text: 'Verify certificate', attrs: { href: verify, target: '_blank', rel: 'noopener noreferrer' } }, [icon('arrow-up-right')])
                : null
        ])
    ]);
}
