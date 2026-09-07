/*
 * Everything on this page is invented in the browser. There is no cold-chain
 * temperature API to call — this is a prototype standing in for a report a
 * local team might ship as a plugin, so the numbers only have to be plausible
 * and to hold still.
 *
 * "Hold still" is the important part: a given facility + month must always
 * produce the same log, so a shared link opens the same report and a print
 * matches the screen. So the data is derived from the selection with a seeded
 * generator rather than Math.random().
 */

/* The stand-in facilities. A short, obviously-local list — the whole point is
 * that this report serves a handful of sites nobody else reports on. */
export const FACILITIES = [
    { id: 'mnazi', name: 'Mnazi Mmoja Health Centre' },
    { id: 'kizimkazi', name: 'Kizimkazi Dispensary' },
    { id: 'chake', name: 'Chake Chake District Hospital' },
    { id: 'wete', name: 'Wete Cold Store' },
]

/* The range a vaccine fridge is meant to hold. Anything outside it is an
 * excursion — the thing the log exists to catch. */
export const SAFE_MIN_C = 2
export const SAFE_MAX_C = 8

export const DAY_STATUS = {
    COLD: 'cold', // dipped below the safe range
    OK: 'ok',
    WARM: 'warm', // rose above the safe range
    MISSING: 'missing', // no reading logged that day
}

/* A tiny deterministic PRNG. The seed is hashed from the selection, so the
 * same facility and month always yield the same sequence. */
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

const round1 = (n) => Math.round(n * 10) / 10

const statusFor = (min, max) => {
    if (min < SAFE_MIN_C) {
        return DAY_STATUS.COLD
    }
    if (max > SAFE_MAX_C) {
        return DAY_STATUS.WARM
    }
    return DAY_STATUS.OK
}

const HOURS = 24

/*
 * One day's 24 hourly readings. A normal day drifts gently around the middle
 * of the safe band with a slight midday warming; a spoilt day has an excursion
 * pushed into a window of hours — this is what the day-trace chart draws, and
 * the daily min/max on the calendar is read back off it, so the two can never
 * disagree.
 */
const buildHourly = (rand, kind) => {
    const centre = 4.5 + (rand() - 0.5) * 1.4

    /* A warm excursion sits in the afternoon; a cold one runs overnight. */
    const window =
        kind === DAY_STATUS.WARM
            ? { start: 11 + Math.floor(rand() * 4), peak: 9.5 + rand() * 3.5 }
            : kind === DAY_STATUS.COLD
            ? { start: 1 + Math.floor(rand() * 3), peak: -1.5 - rand() * 2.5 }
            : null
    const span = window ? 3 + Math.floor(rand() * 3) : 0
    /* Centre the bump on a whole hour so one reading actually reaches the peak
     * — otherwise the excursion only grazes the threshold and reads as mild. */
    const mid = window ? Math.round(window.start + span / 2) : 0

    const hourly = []
    for (let hour = 0; hour < HOURS; hour++) {
        /* Base diurnal wave, warmest mid-afternoon, plus a little noise. */
        let temp =
            centre +
            0.6 * Math.sin(((hour - 6) / HOURS) * 2 * Math.PI) +
            (rand() - 0.5) * 0.6

        if (window && hour >= window.start && hour <= window.start + span) {
            /* A triangular bump towards the peak, tallest at the middle of
             * the window and tapering to the edges. */
            const closeness = 1 - Math.abs(hour - mid) / (span / 2 + 0.5)
            temp = temp + (window.peak - temp) * Math.max(closeness, 0)
        }

        hourly.push(round1(temp))
    }
    return { hourly, span }
}

/*
 * Build the month's daily readings for one facility.
 *
 * `month` is a `YYYY-MM` string (what the rail's month input produces).
 * Returns the facility, the days of that month as { date, day, weekday,
 * hourly, min, max, status, note }, and the excursions pulled out for the
 * summary list.
 */
export const buildFridgeLog = (facilityId, month) => {
    const facility = FACILITIES.find((f) => f.id === facilityId)
    if (!facility || !month) {
        return null
    }

    const [year, monthNo] = month.split('-').map(Number)
    const daysInMonth = new Date(year, monthNo, 0).getDate()

    const rand = mulberry32(hashSeed(`${facilityId}:${month}`))

    /* Pick two days to spoil, so every log has something red or blue on it and
     * the excursion list is never empty — that is what makes the demo read. */
    const warmDay = 1 + Math.floor(rand() * (daysInMonth - 2))
    let coldDay = 1 + Math.floor(rand() * (daysInMonth - 2))
    if (coldDay === warmDay) {
        coldDay = ((coldDay + 3) % daysInMonth) + 1
    }
    /* And one gap in the record — a day nobody logged. */
    const missingDay = 1 + Math.floor(rand() * (daysInMonth - 2))

    const days = []
    const excursions = []

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthNo - 1, day)
        const weekday = date.getDay() // 0 = Sunday

        if (day === missingDay) {
            days.push({
                date,
                day,
                weekday,
                hourly: null,
                min: null,
                max: null,
                status: DAY_STATUS.MISSING,
                note: null,
            })
            continue
        }

        /* What kind of day to draw — a plain one, or one carrying an
         * engineered excursion so the demo always has something to open. */
        const kind =
            day === warmDay
                ? DAY_STATUS.WARM
                : day === coldDay
                ? DAY_STATUS.COLD
                : DAY_STATUS.OK

        const { hourly, span } = buildHourly(rand, kind)
        const min = Math.min(...hourly)
        const max = Math.max(...hourly)
        const status = statusFor(min, max)

        let note = null
        if (status === DAY_STATUS.WARM) {
            note = `Peaked at ${max} °C for about ${span} h` // door left open
        } else if (status === DAY_STATUS.COLD) {
            note = `Dropped to ${min} °C overnight` // thermostat too low
        }

        if (status !== DAY_STATUS.OK) {
            excursions.push({ day, date, status, note, min, max })
        }

        days.push({ date, day, weekday, hourly, min, max, status, note })
    }

    const logged = days.filter((d) => d.status !== DAY_STATUS.MISSING).length

    return {
        facility,
        month,
        year,
        monthNo,
        days,
        excursions,
        logged,
        missing: daysInMonth - logged,
    }
}
