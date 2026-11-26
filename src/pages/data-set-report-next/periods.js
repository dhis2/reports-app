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
 * FinancialNov. `supportsPeriodType` reports those, and the period type
 * select filters them out — offering one could only produce an empty list.
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

/*
 * Roughly how long each period type lasts, in days.
 *
 * Only used for comparing types with each other, so the values need to be in
 * the right order rather than exact — a quarter as 91 days is close enough to
 * sit between a bi-month and a six-month.
 */
const LENGTH_IN_DAYS = {
    Daily: 1,
    Weekly: 7,
    WeeklyWednesday: 7,
    WeeklyThursday: 7,
    WeeklySaturday: 7,
    WeeklySunday: 7,
    BiWeekly: 14,
    Monthly: 30,
    BiMonthly: 60,
    Quarterly: 91,
    QuarterlyNov: 91,
    SixMonthly: 182,
    SixMonthlyApril: 182,
    SixMonthlyNov: 182,
    Yearly: 365,
    FinancialApril: 365,
    FinancialJuly: 365,
    FinancialOct: 365,
    FinancialNov: 365,
}

/**
 * Whether a data set collected at `dataSetPeriodType` can be reported for
 * `periodType`.
 *
 * Values can be added up into a longer period but never split into a shorter
 * one: a monthly data set has a figure for August, and no way to say what
 * part of it belonged to the 3rd. Asking for a shorter period than the data
 * set's own returns an empty report, so those types are offered but disabled
 * rather than left to fail.
 *
 * An unknown type on either side is allowed through — better to let the
 * server refuse it than to hide a period type on a guess.
 */
export const canReportAtPeriodType = (dataSetPeriodType, periodType) => {
    const collected = LENGTH_IN_DAYS[dataSetPeriodType]
    const asked = LENGTH_IN_DAYS[periodType]

    return !collected || !asked || asked >= collected
}

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
