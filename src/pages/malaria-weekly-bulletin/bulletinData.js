/*
 * Like the cold-chain log, everything here is invented in the browser. There
 * is no weekly-surveillance API behind this — it is a prototype standing in for
 * a bulletin a district malaria team might ship as a "report plugin".
 *
 * The org unit is real (the rail uses the live tree), but the case counts are
 * seeded from the org unit id and the chosen week, so a given bulletin always
 * renders the same — a shared link opens the same numbers, and a print matches
 * the screen.
 */

/* How many weeks of history the bulletin carries, including the chosen one. */
export const WINDOW_WEEKS = 12

export const AGE_BANDS = [
    { key: 'u5', label: '<5' },
    { key: 'a5to14', label: '5–14' },
    { key: 'a15plus', label: '15+' },
]

/* Deterministic PRNG, same pair as fridgeData.js. */
const hashSeed = (str) => {
    let h = 2166136261
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

const mulberry32 = (seed) => () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/* "2026-W34" -> { year: 2026, week: 34 }. */
export const parseWeek = (value) => {
    const match = /^(\d{4})-W(\d{2})$/.exec(value || '')
    if (!match) {
        return null
    }
    return { year: Number(match[1]), week: Number(match[2]) }
}

/* The current epi-week, as the week input's YYYY-Www string. Rough ISO-ish
 * week number — close enough for a prototype's default. */
export const thisWeek = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const week = Math.ceil(
        ((now - start) / 86400000 + start.getDay() + 1) / 7
    )
    return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

/* The WINDOW_WEEKS weeks ending at (and including) the chosen one, oldest
 * first. Weeks below 1 wrap back into the previous year. */
const weekWindow = (year, week) => {
    const weeks = []
    for (let i = WINDOW_WEEKS - 1; i >= 0; i--) {
        let w = week - i
        let y = year
        while (w < 1) {
            w += 52
            y -= 1
        }
        weeks.push({ year: y, week: w, label: `Wk ${w}` })
    }
    return weeks
}

const round = Math.round

/*
 * Build the bulletin.
 *
 * `orgUnitId` seeds the level (a big referral site sees more cases than a rural
 * one), `week` (a YYYY-Www string) fixes the window. `orgUnitName` is carried
 * through only so the caller can label the sheet.
 */
export const buildBulletin = (orgUnitId, orgUnitName, week) => {
    const parsed = parseWeek(week)
    if (!orgUnitId || !parsed) {
        return null
    }

    const rand = mulberry32(hashSeed(`${orgUnitId}:${week}`))

    /* A per-site baseline caseload, so different org units read differently. */
    const baseline = 120 + Math.floor(rand() * 380)

    /* A gentle seasonal wave across the window, plus a phase unique to the
     * site, so the trend line has a believable shape rather than noise. */
    const phase = rand() * Math.PI * 2

    const window = weekWindow(parsed.year, parsed.week)

    const series = window.map((w, i) => {
        const seasonal = 1 + 0.45 * Math.sin(phase + (i / WINDOW_WEEKS) * 2.2)
        const jitter = 0.85 + rand() * 0.3
        const confirmed = round(baseline * seasonal * jitter)

        /* Positivity drifts with the season too; tested is derived from it. */
        const positivity = 0.1 + 0.16 * seasonal * (0.9 + rand() * 0.2)
        const tested = round(confirmed / Math.max(positivity, 0.05))
        const suspected = round(tested * (1.05 + rand() * 0.25))
        const deaths = Math.max(
            0,
            round((confirmed / 1000) * (rand() * 3))
        )

        /* Confirmed cases split across the age bands, under-fives heaviest. */
        const u5 = round(confirmed * (0.34 + rand() * 0.06))
        const a5to14 = round(confirmed * (0.28 + rand() * 0.06))
        const a15plus = Math.max(0, confirmed - u5 - a5to14)

        return {
            ...w,
            suspected,
            tested,
            confirmed,
            deaths,
            positivity: confirmed / Math.max(tested, 1),
            ages: { u5, a5to14, a15plus },
        }
    })

    const current = series[series.length - 1]
    const previous = series[series.length - 2]

    return {
        orgUnitId,
        orgUnitName,
        week,
        current,
        previous,
        series,
    }
}

/* Signed fractional change between two values, or null when there is no base
 * to compare against. */
export const delta = (current, previous) => {
    if (!previous) {
        return null
    }
    return (current - previous) / previous
}
