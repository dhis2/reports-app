import { useDataQuery, useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'

/*
 * When the analytics tables were last built.
 *
 * A report carries two different ages, and only one of them has been on
 * screen so far: when this copy of the report was drawn, and how old the
 * numbers in it are. The second is the one that decides whether today's entry
 * is in here, and it belongs to the server rather than to the report — every
 * report on the instance is reading the same tables.
 *
 * So it is asked once, here, and every report screen shows the same answer.
 */
const SYSTEM_INFO_QUERY = {
    info: {
        resource: 'system/info',
        params: { fields: 'lastAnalyticsTableSuccess' },
    },
}

/*
 * PROTOTYPE ONLY — a stand-in for instances that have never run analytics,
 * which is most training databases. Without it the line the prototype is
 * meant to demonstrate would simply not appear.
 *
 * Last night's run, because that is what a maintained instance looks like:
 * scheduled overnight, so the numbers are yesterday's close.
 *
 * Delete this and the `??` below, and the line then tells the truth on every
 * instance — appearing only where analytics have actually run.
 */
const mockLastAnalyticsRun = () => {
    const at = new Date()
    at.setHours(1, 30, 0, 0)

    /* Before 01:30 the "last" run is the one the night before. */
    if (at.getTime() > Date.now()) {
        at.setDate(at.getDate() - 1)
    }

    return at
}

/**
 * The moment the analytics tables were last built, as a Date, or null if the
 * instance has never built them.
 */
export const useAnalyticsGeneratedAt = () => {
    /*
     * Errors are answered the same way as an instance that has never run
     * analytics: this is a footnote on someone else's report, and a failure
     * to fetch it is not worth a notice of its own.
     */
    const { data } = useDataQuery(SYSTEM_INFO_QUERY)
    const reported = data?.info?.lastAnalyticsTableSuccess

    /*
     * DHIS2 writes timestamps in the server's timezone with no offset, so
     * reading one as local time makes a run from this morning look hours off.
     */
    const { fromServerDate } = useTimeZoneConversion()

    return useMemo(
        () => (reported ? fromServerDate(reported) : mockLastAnalyticsRun()),
        [reported, fromServerDate]
    )
}

/*
 * Short and numeric, matching the "report created" timestamp it sits beside —
 * these are stamps on a summary line, not dates anyone reads out. The locale
 * decides the order of the parts, so this never hard-codes day-before-month.
 */
export const formatAnalyticsTime = (generatedAt) =>
    generatedAt.toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

/**
 * The summary-line phrase, e.g. "Analytics generated 08/09/26, 01:30".
 * Returns '' when the instance has never run analytics, so it drops out of
 * the line rather than leaving a label with nothing after it.
 */
export const analyticsLabel = (generatedAt) =>
    generatedAt
        ? i18n.t('Analytics generated {{when}}', {
              when: formatAnalyticsTime(generatedAt),
              /*
               * i18next HTML-escapes interpolated values by default, which
               * turns the slashes of a numeric date into &#x2F;. React
               * escapes on render anyway, so escaping here only ever
               * double-escapes.
               */
              interpolation: { escapeValue: false },
          })
        : ''
