import { createPeriodGeneratorsForLocale } from 'd2/period/generators'

/*
 * Period list building for the prototype.
 *
 * These generators are pure functions from `d2` — importing them does not
 * touch the d2 instance, so this file stays free of the legacy plumbing.
 * Each generator returns { id, name, startDate, endDate } with ISO dates.
 */
const generators = createPeriodGeneratorsForLocale('en')

/* Period types generated one calendar year at a time */
const BY_YEAR = {
    Daily: 'generateDailyPeriodsForYear',
    Weekly: 'generateWeeklyPeriodsForYear',
    Monthly: 'generateMonthlyPeriodsForYear',
    BiMonthly: 'generateBiMonthlyPeriodsForYear',
    Quarterly: 'generateQuarterlyPeriodsForYear',
    SixMonthly: 'generateSixMonthlyPeriodsForYear',
    SixMonthlyApril: 'generateSixMonthlyAprilPeriodsForYear',
}

/* Period types generated as "the last N up to this year" — no year picker */
const UP_TO_YEAR = {
    Yearly: 'generateYearlyPeriodsUpToYear',
    FinancialApril: 'generateFinancialAprilPeriodsUpToYear',
    FinancialJuly: 'generateFinancialJulyPeriodsUpToYear',
    FinancialOct: 'generateFinancialOctoberPeriodsUpToYear',
}

/*
 * Known gap: d2 ships no generator for WeeklyWednesday, WeeklyThursday,
 * WeeklySaturday, WeeklySunday, BiWeekly, QuarterlyNov, SixMonthlyNov or
 * FinancialNov. Data sets using those are reported by `supportsPeriodType`
 * so the UI can say so plainly instead of showing an empty list.
 */
/*
 * How far back to offer periods. Instances routinely hold a decade or more of
 * history, and imported data can go back further still, so this needs to be
 * generous. The year select is filterable, so a long list stays usable.
 */
export const YEARS_OF_HISTORY = 30

export const supportsPeriodType = (periodType) =>
    Boolean(BY_YEAR[periodType] || UP_TO_YEAR[periodType])

export const needsYear = (periodType) => Boolean(BY_YEAR[periodType])

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Newest first, because that is what people almost always want.
 *
 * `howManyYears` only applies to the yearly and financial-year types, which
 * generate a run of periods instead of using the year picker.
 */
export const generatePeriods = (
    periodType,
    year,
    howManyYears = YEARS_OF_HISTORY
) => {
    if (UP_TO_YEAR[periodType]) {
        return [...generators[UP_TO_YEAR[periodType]](year, howManyYears)]
            .reverse()
    }

    const generator = BY_YEAR[periodType]
    return generator ? [...generators[generator](year)].reverse() : []
}

/*
 * Drop periods that cannot hold data yet.
 *
 * `openFuturePeriods` on the data set is the number of not-yet-finished
 * periods open for entry. With the usual value of 0, only periods that have
 * already ended are offered — which is why asking for "this month" so often
 * returns an empty report today.
 */
export const dropUnopenedPeriods = (periods, openFuturePeriods = 0) => {
    const now = today()
    const ended = periods.filter((period) => period.endDate <= now)
    const notEnded = periods.filter((period) => period.endDate > now)

    // `periods` is newest first, so the periods nearest to now sit at the
    // end of `notEnded`.
    const open =
        openFuturePeriods > 0 ? notEnded.slice(-openFuturePeriods) : []

    return [...open, ...ended]
}

/** The most recent period that has finished. Used to preselect sensibly. */
export const newestEndedPeriod = (periods) => {
    const now = today()
    return periods.find((period) => period.endDate <= now)
}

export const yearOptions = (howMany = YEARS_OF_HISTORY) => {
    const thisYear = new Date().getFullYear()
    return Array.from({ length: howMany }, (_, index) => thisYear - index)
}
