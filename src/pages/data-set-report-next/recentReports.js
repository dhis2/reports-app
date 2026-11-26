/*
 * "Recently created reports" — the shortcut back to a report you ran before.
 *
 * Prototype storage: the list lives in local storage, per report type, and is
 * seeded with a few plausible entries so the empty state has something to show
 * on a fresh machine (and in a demo). Nothing here talks to the server.
 */
const STORAGE_KEY = 'reports-app:data-set-report-next:recent'
const LIMIT = 6

/*
 * Seeds, so the feature is visible before you have run anything yourself.
 *
 * These four are chosen for a demo on the SL database: each has data for the
 * period given, and between them they cover both views — Child Health and
 * Reproductive Health are section forms, Life-Saving Commodities and
 * Morbidity are custom-designed forms, which is what "Data entry form" has to
 * show to be worth the toggle.
 */
const SEEDS = [
    {
        dsId: 'BfMAe6Itzgt',
        dataSetName: 'Child Health',
        periodType: 'Monthly',
        pe: '202608',
        periodName: 'August 2026',
        ouPath: '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8',
        orgUnitName: 'Ngelehun CHC',
        selectedUnitOnly: false,
        filters: {},
    },
    {
        dsId: 'ULowA8V3ucd',
        dataSetName: 'Life-Saving Commodities',
        periodType: 'Monthly',
        pe: '202608',
        periodName: 'August 2026',
        ouPath: '/ImspTQPwCqd/O6uvpzGd5pu/YuQRtpLP10I/DiszpKrYNg8',
        orgUnitName: 'Ngelehun CHC',
        selectedUnitOnly: false,
        filters: {},
    },
    {
        dsId: 'eZDhcZi6FLP',
        dataSetName: 'Morbidity',
        periodType: 'Monthly',
        pe: '202608',
        periodName: 'August 2026',
        ouPath: '/ImspTQPwCqd/O6uvpzGd5pu',
        orgUnitName: 'Bo',
        selectedUnitOnly: false,
        filters: {},
    },
    {
        dsId: 'QX4ZTUbOt3a',
        dataSetName: 'Reproductive Health',
        periodType: 'Monthly',
        pe: '202608',
        periodName: 'August 2026',
        ouPath: '/ImspTQPwCqd/O6uvpzGd5pu',
        orgUnitName: 'Bo',
        selectedUnitOnly: false,
        filters: {},
    },
]

/* A report is "the same one" if it asked the same question. */
const keyOf = (entry) =>
    [
        entry.dsId,
        entry.pe,
        entry.ouPath,
        entry.selectedUnitOnly ? '1' : '0',
        Object.entries(entry.filters || {})
            .map((pair) => pair.join(':'))
            .sort()
            .join(','),
    ].join('|')

export const readRecentReports = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : SEEDS
    } catch {
        return SEEDS
    }
}

export const addRecentReport = (entry) => {
    const next = [
        entry,
        ...readRecentReports().filter((item) => keyOf(item) !== keyOf(entry)),
    ].slice(0, LIMIT)

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
        // A convenience — never break the page over it.
    }

    return next
}
