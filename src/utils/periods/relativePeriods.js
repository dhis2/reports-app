import i18n from '@dhis2/d2-i18n'

const THIS_DAY = 'thisDay'
const YESTERDAY = 'yesterday'
const LAST_3_DAYS = 'last3Days'
const LAST_7_DAYS = 'last7Days'
const LAST_14_DAYS = 'last14Days'
const THIS_WEEK = 'thisWeek'
const LAST_WEEK = 'lastWeek'
const LAST_4_WEEKS = 'last4Weeks'
const LAST_12_WEEKS = 'last12Weeks'
const LAST_52_WEEKS = 'last52Weeks'
const WEEKS_THIS_YEAR = 'weeksThisYear'
const THIS_MONTH = 'thisMonth'
const LAST_MONTH = 'lastMonth'
const LAST_3_MONTHS = 'last3Months'
const LAST_6_MONTHS = 'last6Months'
const LAST_12_MONTHS = 'last12Months'
const MONTHS_THIS_YEAR = 'monthsThisYear'
const THIS_BIMONTH = 'thisBimonth'
const LAST_BIMONTH = 'lastBimonth'
const LAST_6_BI_MONTHS = 'last6BiMonths'
const BI_MONTHS_THIS_YEAR = 'biMonthsThisYear'
const THIS_QUARTER = 'thisQuarter'
const LAST_QUARTER = 'lastQuarter'
const LAST_4_QUARTERS = 'last4Quarters'
const QUARTERS_THIS_YEAR = 'quartersThisYear'
const THIS_SIX_MONTH = 'thisSixMonth'
const LAST_SIX_MONTH = 'lastSixMonth'
const LAST_2_SIX_MONTHS = 'last2SixMonths'
const THIS_FINANCIAL_YEAR = 'thisFinancialYear'
const LAST_FINANCIAL_YEAR = 'lastFinancialYear'
const LAST_5_FINANCIAL_YEARS = 'last5FinancialYears'
const THIS_YEAR = 'thisYear'
const LAST_YEAR = 'lastYear'
const LAST_5_YEARS = 'last5Years'

export const RELATIVE_PERIODS = [
    // Days
    {
        label: i18n.t('Days'),
        options: [
            {
                value: THIS_DAY,
                label: i18n.t('Reporting day'),
            },
            {
                value: YESTERDAY,
                label: i18n.t('Yesterday'),
            },
            {
                value: LAST_3_DAYS,
                label: i18n.t('Last 3 days'),
            },
            {
                value: LAST_7_DAYS,
                label: i18n.t('Last 7 days'),
            },
            {
                value: LAST_14_DAYS,
                label: i18n.t('Last 14 days'),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t('Weeks'),
        options: [
            {
                value: THIS_WEEK,
                label: i18n.t('Reporting week'),
            },
            {
                value: LAST_WEEK,
                label: i18n.t('Last Week'),
            },
            {
                value: LAST_4_WEEKS,
                label: i18n.t('Last 2 weeks'),
            },
            {
                value: LAST_12_WEEKS,
                label: i18n.t('Last 12 weeks'),
            },
            {
                value: LAST_52_WEEKS,
                label: i18n.t('Last 52 weeks'),
            },
            {
                value: WEEKS_THIS_YEAR,
                label: i18n.t('Weeks this year'),
            },
        ],
    },
    // Months
    {
        label: i18n.t('Months'),
        options: [
            {
                value: THIS_MONTH,
                label: i18n.t('Reporting month'),
            },
            {
                value: LAST_MONTH,
                label: i18n.t('Last month'),
            },
            {
                value: LAST_3_MONTHS,
                label: i18n.t('Last 3 months'),
            },
            {
                value: LAST_6_MONTHS,
                label: i18n.t('Last 6 months'),
            },
            {
                value: LAST_12_MONTHS,
                label: i18n.t('Last 12 months'),
            },
            {
                value: MONTHS_THIS_YEAR,
                label: i18n.t('Months this year'),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t('Bi-months'),
        options: [
            {
                value: THIS_BIMONTH,
                label: i18n.t('Reporting bi-month'),
            },
            {
                value: LAST_BIMONTH,
                label: i18n.t('Last bi-month'),
            },
            {
                value: LAST_6_BI_MONTHS,
                label: i18n.t('Last 6 bi-month'),
            },
            {
                value: BI_MONTHS_THIS_YEAR,
                label: i18n.t('Bi-months this year'),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t('Quarters'),
        options: [
            {
                value: THIS_QUARTER,
                label: i18n.t('Reporting quarter'),
            },
            {
                value: LAST_QUARTER,
                label: i18n.t('Last quarter'),
            },
            {
                value: LAST_4_QUARTERS,
                label: i18n.t('Last 4 quarters'),
            },
            {
                value: QUARTERS_THIS_YEAR,
                label: i18n.t('Quarters of reporting year'),
            },
        ],
    },
    // Six-Months
    {
        label: i18n.t('Six-Months'),
        options: [
            {
                value: THIS_SIX_MONTH,
                label: i18n.t('Reporting six-month'),
            },
            {
                value: LAST_SIX_MONTH,
                label: i18n.t('Last six-month'),
            },
            {
                value: LAST_2_SIX_MONTHS,
                label: i18n.t('Last 2 six-months'),
            },
        ],
    },
    // Financial years
    {
        label: i18n.t('Financial Years'),
        options: [
            {
                value: THIS_FINANCIAL_YEAR,
                label: i18n.t('Reporting financial year'),
            },
            {
                value: LAST_FINANCIAL_YEAR,
                label: i18n.t('Last financial year'),
            },
            {
                value: LAST_5_FINANCIAL_YEARS,
                label: i18n.t('Last 5 financial years'),
            },
        ],
    },
    // years
    {
        label: i18n.t('Years'),
        options: [
            {
                value: THIS_YEAR,
                label: i18n.t('Reporting year'),
            },
            {
                value: LAST_YEAR,
                label: i18n.t('Last year'),
            },
            {
                value: LAST_5_YEARS,
                label: i18n.t('Last 5 years'),
            },
        ],
    },
]

export const flattenedRelativePeriods = RELATIVE_PERIODS.reduce(
    (acc, group) => {
        group.options.forEach((period) => {
            acc[period.value] = {
                id: period.value,
                displayName: period.label,
            }
        })
        return acc
    },
    {}
)

// This helper was "borrowed" from
// https://github.com/dhis2/analytics/blob/master/src/components/PeriodDimension/utils/fixedPeriods.js#L537-L546
// The plan is to eventually move the getRelativePeriodStartDate code over to the anaytics repo,
// so we are using the helpers as they are there
const formatYyyyMmDd = (timestamp) => {
    const date = new Date(timestamp)
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date.getDate().toString().padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

// We are passing `Date.now()` to the `Date` constructor to make this
// module easier to unit test. This way we only have to mock `Date.now`,
// which is a lot easier than to mock the `Date` class
// See here for more info: https://codewithhugo.com/mocking-the-current-date-in-jest-tests/
const getCurrentDate = () => new Date(Date.now())

const getPreviousMonday = (date) => {
    const day = date.getDay()
    // date.getDay() will return 0 for a Sunday and 1 for a Monday
    // so a week starts on Sunday according to the Date API, but
    // we want the fist day of the week to be Monday, so we need this:
    // `day + (day === 0 ? -6 : 1)`
    const mondayTimeStamp = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(mondayTimeStamp))
}

const daysAgo = (offset) => {
    const now = getCurrentDate()

    return now.setDate(now.getDate() - offset)
}

const weeksAgo = (offset) => {
    const previousMonday = getPreviousMonday(getCurrentDate())

    return previousMonday.setDate(previousMonday.getDate() - offset * 7)
}

const weeksThisYear = () => {
    const year = getCurrentDate().getFullYear()
    // Calculate the first date of an EPI year base on ISO standard  ( first week always contains 4th Jan )
    const jan4 = new Date(`${year}-01-04`)
    const firstMondayOfYear = getPreviousMonday(jan4)

    return firstMondayOfYear.getTime()
}

const startOfYear = () => {
    const year = getCurrentDate().getFullYear()
    const jan1 = new Date(`${year}-01-01`)

    return jan1.getTime()
}

const monthUnitsAgo = (unitSize, offset) => {
    const now = getCurrentDate()
    const year = now.getFullYear()
    const monthIndex = now.getMonth()
    // Round down to nearest even number so feb(1) will become jan(0)
    const firstMonthIndex = unitSize * Math.floor(monthIndex / unitSize)
    const firstMonthStr = (firstMonthIndex + 1).toString().padStart(2, '0')
    const firstMonthStartDate = new Date(`${year}-${firstMonthStr}-01`)

    return firstMonthStartDate.setMonth(
        firstMonthStartDate.getMonth() - offset * unitSize
    )
}

const yearsAgo = (offset, isFinancial) => {
    const currentYear = getCurrentDate().getFullYear()
    const startYear = currentYear - offset
    return new Date(isFinancial ? `${startYear}-10-01` : `${startYear}-01-01`)
}

const startDateCalculators = {
    [THIS_DAY]: () => daysAgo(0),
    [YESTERDAY]: () => daysAgo(1),
    [LAST_3_DAYS]: () => daysAgo(3),
    [LAST_7_DAYS]: () => daysAgo(7),
    [LAST_14_DAYS]: () => daysAgo(14),
    [THIS_WEEK]: () => weeksAgo(0),
    [LAST_WEEK]: () => weeksAgo(1),
    [LAST_4_WEEKS]: () => weeksAgo(4),
    [LAST_12_WEEKS]: () => weeksAgo(12),
    [LAST_52_WEEKS]: () => weeksAgo(52),
    [WEEKS_THIS_YEAR]: () => weeksThisYear(),
    [THIS_MONTH]: () => monthUnitsAgo(1, 0),
    [LAST_MONTH]: () => monthUnitsAgo(1, 1),
    [LAST_3_MONTHS]: () => monthUnitsAgo(1, 3),
    [LAST_6_MONTHS]: () => monthUnitsAgo(1, 6),
    [LAST_12_MONTHS]: () => monthUnitsAgo(1, 12),
    [MONTHS_THIS_YEAR]: () => startOfYear(),
    [THIS_BIMONTH]: () => monthUnitsAgo(2, 0),
    [LAST_BIMONTH]: () => monthUnitsAgo(2, 1),
    [LAST_6_BI_MONTHS]: () => monthUnitsAgo(2, 6),
    [BI_MONTHS_THIS_YEAR]: () => startOfYear(),
    [THIS_QUARTER]: () => monthUnitsAgo(3, 0),
    [LAST_QUARTER]: () => monthUnitsAgo(3, 1),
    [LAST_4_QUARTERS]: () => monthUnitsAgo(3, 4),
    [QUARTERS_THIS_YEAR]: () => startOfYear(),
    [THIS_SIX_MONTH]: () => monthUnitsAgo(6, 0),
    [LAST_SIX_MONTH]: () => monthUnitsAgo(6, 1),
    [LAST_2_SIX_MONTHS]: () => monthUnitsAgo(6, 2),
    [THIS_FINANCIAL_YEAR]: () => yearsAgo(0, true),
    [LAST_FINANCIAL_YEAR]: () => yearsAgo(1, true),
    [LAST_5_FINANCIAL_YEARS]: () => yearsAgo(5, true),
    [THIS_YEAR]: () => yearsAgo(0),
    [LAST_YEAR]: () => yearsAgo(1),
    [LAST_5_YEARS]: () => yearsAgo(5),
}

export const getRelativePeriodStartDate = (periodCode) => {
    const startDateCalutator = startDateCalculators[periodCode]

    if (!startDateCalutator) {
        return null
    }

    return formatYyyyMmDd(startDateCalutator())
}
