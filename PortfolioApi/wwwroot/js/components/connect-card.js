import { el, icon } from '../core/dom.js';

/**
 * Large link card for a contact channel (GitHub, LinkedIn, Email).
 * @param {{ href: string, label: string, value: string, iconName: string, tone: string, external?: boolean }} channel
 */
export function createConnectCard(channel, index) {
    const attrs = { href: channel.href, 'aria-label': `${channel.label}: ${channel.value}` };
    if (channel.external) Object.assign(attrs, { target: '_blank', rel: 'noopener noreferrer' });

    return el('a', {
        class: `connect__card connect__card--${channel.tone} card spotlight reveal`,
        attrs: { ...attrs, 'data-reveal-delay': String(index) }
    }, [
        el('span', { class: 'connect__icon' }, [icon(channel.iconName)]),
        el('span', { class: 'connect__text' }, [
            el('small', { text: channel.label }),
            el('span', { class: 'connect__value', text: channel.value })
        ]),
        el('span', { class: 'connect__arrow' }, [icon('arrow-up-right')])
    ]);
}

/** Compact round icon link used in the hero and footer. */
export function createSocialIcon(channel) {
    const attrs = { href: channel.href, 'aria-label': channel.label };
    if (channel.external) Object.assign(attrs, { target: '_blank', rel: 'noopener noreferrer' });
    return el('a', { class: 'icon-btn icon-btn--lg', attrs }, [icon(channel.iconName)]);
}
