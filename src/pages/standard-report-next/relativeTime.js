import i18n from '@dhis2/d2-i18n'

/*
 * "2 years ago" rather than "2013-11-11T22:02:02.848".
 *
 * Built on Intl.RelativeTimeFormat so the phrasing and pluralisation come from
 * the viewer's locale instead of from strings we would otherwise have to
 * translate ourselves for every unit and count.
 *
 * Both functions take a Date already in client time. DHIS2 timestamps carry
 * no timezone and are written in the server's, so converting them is the
 * caller's job — app-runtime's useTimeZoneConversion does it properly, and
 * getting it wrong makes something saved a moment ago read as hours old.
 */

const UNITS = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
]

/*
 * Clocks are never exactly in step, so a timestamp can land a little in the
 * future. "in 30 seconds" for something that has already happened is worse
 * than being vague.
 */
const JUST_NOW = 60 * 1000

export const timeAgo = (date) => {
    if (!date || Number.isNaN(date.getTime())) {
        return ''
    }

    const elapsed = Date.now() - date.getTime()

    if (elapsed < JUST_NOW) {
        return i18n.t('just now')
    }

    const formatter = new Intl.RelativeTimeFormat(i18n.language || undefined, {
        numeric: 'auto',
    })

    const [unit, size] = UNITS.find(([, ms]) => elapsed >= ms)

    return formatter.format(-Math.round(elapsed / size), unit)
}

/** The full timestamp, for the title attribute behind the vague version. */
export const exactTime = (date) =>
    !date || Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
