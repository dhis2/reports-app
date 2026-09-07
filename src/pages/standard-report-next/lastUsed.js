/*
 * When each report was last run, remembered in the browser.
 *
 * The server does not record it — a report has a created and a lastUpdated
 * timestamp, and neither says whether anyone actually ran the thing. So the
 * page keeps its own note: opening a report writes the moment, and the list
 * reads it back as a "Last used" column. Sorted on, that column is the
 * recents list nobody has to build.
 *
 * Per-browser rather than per-user, and that is the honest limit of it: it
 * answers "what was I working on" and never "what is popular here".
 */

const STORAGE_KEY = 'reports-app:standard-report-next:last-used'

/*
 * Prototype only — plausible history for the demo designs, so the column has
 * something in it before anyone has clicked anything. Relative to now, so it
 * never reads as stale. Remove with the demo reports.
 */
const HOURS = 60 * 60 * 1000
const SEEDED = {
    demoImmuni1: 3 * HOURS,
    demoReport2: 26 * HOURS,
    demoMatern3: 9 * 24 * HOURS,
}

const seed = () => {
    const now = Date.now()

    return Object.entries(SEEDED).reduce((acc, [id, ago]) => {
        acc[id] = new Date(now - ago).toISOString()
        return acc
    }, {})
}

/** id -> ISO timestamp, for every report this browser has run. */
export const readLastUsed = () => {
    try {
        const stored = JSON.parse(
            window.localStorage.getItem(STORAGE_KEY) || '{}'
        )
        return { ...seed(), ...stored }
    } catch {
        return seed()
    }
}

/** Called when a report is generated, not when it is merely listed. */
export const recordLastUsed = (id) => {
    if (!id) {
        return
    }

    try {
        const stored = JSON.parse(
            window.localStorage.getItem(STORAGE_KEY) || '{}'
        )
        stored[id] = new Date().toISOString()
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
        // A convenience column is never worth an error.
    }
}
