import i18n from '@dhis2/d2-i18n'
import { fixedPeriodTranslations } from './fixedPeriods'

const RELATIVE_PERIOD_CODES = {
    thisDay: 'thisDay',
    yesterday: 'yesterday',
    last3Days: 'last3Days',
    last7Days: 'last7Days',
    last14Days: 'last14Days',
    thisWeek: 'thisWeek',
    lastWeek: 'lastWeek',
    last4Weeks: 'last4Weeks',
    last12Weeks: 'last12Weeks',
    last52Weeks: 'last52Weeks',
    weeksThisYear: 'weeksThisYear',
    thisMonth: 'thisMonth',
    lastMonth: 'lastMonth',
    last3Months: 'last3Months',
    last6Months: 'last6Months',
    last12Months: 'last12Months',
    monthsThisYear: 'monthsThisYear',
    thisBimonth: 'thisBimonth',
    lastBimonth: 'lastBimonth',
    last6BiMonths: 'last6BiMonths',
    biMonthsThisYear: 'biMonthsThisYear',
    thisQuarter: 'thisQuarter',
    lastQuarter: 'lastQuarter',
    last4Quarters: 'last4Quarters',
    quartersThisYear: 'quartersThisYear',
    thisSixMonth: 'thisSixMonth',
    lastSixMonth: 'lastSixMonth',
    last2SixMonths: 'last2SixMonths',
    thisFinancialYear: 'thisFinancialYear',
    lastFinancialYear: 'lastFinancialYear',
    last5FinancialYears: 'last5FinancialYears',
    thisYear: 'thisYear',
    lastYear: 'lastYear',
    last5Years: 'last5Years',
}

export const RELATIVE_PERIODS = [
    // Days
    {
        label: i18n.t('Days'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisDay,
                label: i18n.t('Reporting day'),
            },
            {
                value: RELATIVE_PERIOD_CODES.yesterday,
                label: i18n.t('Yesterday'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last3Days,
                label: i18n.t('Last 3 days'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last7Days,
                label: i18n.t('Last 7 days'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last14Days,
                label: i18n.t('Last 14 days'),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t('Weeks'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisWeek,
                label: i18n.t('Reporting week'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastWeek,
                label: i18n.t('Last Week'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last4Weeks,
                label: i18n.t('Last 2 weeks'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last12Weeks,
                label: i18n.t('Last 12 weeks'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last52Weeks,
                label: i18n.t('Last 52 weeks'),
            },
            {
                value: RELATIVE_PERIOD_CODES.weeksThisYear,
                label: i18n.t('Weeks this year'),
            },
        ],
    },
    // Months
    {
        label: i18n.t('Months'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisMonth,
                label: i18n.t('Reporting month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastMonth,
                label: i18n.t('Last month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last3Months,
                label: i18n.t('Last 3 months'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last6Months,
                label: i18n.t('Last 6 months'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last12Months,
                label: i18n.t('Last 12 months'),
            },
            {
                value: RELATIVE_PERIOD_CODES.monthsThisYear,
                label: i18n.t('Months this year'),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t('Bi-months'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisBimonth,
                label: i18n.t('Reporting bi-month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastBimonth,
                label: i18n.t('Last bi-month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last6BiMonths,
                label: i18n.t('Last 6 bi-month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.biMonthsThisYear,
                label: i18n.t('Bi-months this year'),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t('Quarters'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisQuarter,
                label: i18n.t('Reporting quarter'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastQuarter,
                label: i18n.t('Last quarter'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last4Quarters,
                label: i18n.t('Last 4 quarters'),
            },
            {
                value: RELATIVE_PERIOD_CODES.quartersThisYear,
                label: i18n.t('Quarters of reporting year'),
            },
        ],
    },
    // Six-Months
    {
        label: i18n.t('Six-Months'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisSixMonth,
                label: i18n.t('Reporting six-month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastSixMonth,
                label: i18n.t('Last six-month'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last2SixMonths,
                label: i18n.t('Last 2 six-months'),
            },
        ],
    },
    // Financial years
    {
        label: i18n.t('Financial Years'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisFinancialYear,
                label: i18n.t('Reporting financial year'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastFinancialYear,
                label: i18n.t('Last financial year'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last5FinancialYears,
                label: i18n.t('Last 5 financial years'),
            },
        ],
    },
    // years
    {
        label: i18n.t('Years'),
        options: [
            {
                value: RELATIVE_PERIOD_CODES.thisYear,
                label: i18n.t('Reporting year'),
            },
            {
                value: RELATIVE_PERIOD_CODES.lastYear,
                label: i18n.t('Last year'),
            },
            {
                value: RELATIVE_PERIOD_CODES.last5Years,
                label: i18n.t('Last 5 years'),
            },
        ],
    },
]

export const flattenedRelativePeriods = RELATIVE_PERIODS.reduce(
    (acc, group) => {
        group.options.forEach(period => {
            acc[period.value] = {
                id: period.value,
                displayName: period.label,
            }
        })
        return acc
    },
    {}
)

export const isFixedPeriodType = periodType =>
    !!fixedPeriodTranslations[periodType]

const formatYyyyMmDd = timestamp => {
    const date = new Date(timestamp)
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1).toString().padStart(2, '0')
    const dd = date
        .getDate()
        .toString()
        .padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

const getCurrentDate = () => new Date(Date.now())

const getPreviousMonday = date => {
    const day = date.getDay()
    const mondayTimeStamp = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(mondayTimeStamp))
}

const daysAgo = offset => {
    const now = getCurrentDate()

    return now.setDate(now.getDate() - offset)
}

const weeksAgo = offset => {
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
    [RELATIVE_PERIOD_CODES.thisDay]: () => daysAgo(0),
    [RELATIVE_PERIOD_CODES.yesterday]: () => daysAgo(1),
    [RELATIVE_PERIOD_CODES.last3Days]: () => daysAgo(3),
    [RELATIVE_PERIOD_CODES.last7Days]: () => daysAgo(7),
    [RELATIVE_PERIOD_CODES.last14Days]: () => daysAgo(14),
    [RELATIVE_PERIOD_CODES.thisWeek]: () => weeksAgo(0),
    [RELATIVE_PERIOD_CODES.lastWeek]: () => weeksAgo(1),
    [RELATIVE_PERIOD_CODES.last4Weeks]: () => weeksAgo(4),
    [RELATIVE_PERIOD_CODES.last12Weeks]: () => weeksAgo(12),
    [RELATIVE_PERIOD_CODES.last52Weeks]: () => weeksAgo(52),
    [RELATIVE_PERIOD_CODES.weeksThisYear]: () => weeksThisYear(),
    [RELATIVE_PERIOD_CODES.thisMonth]: () => monthUnitsAgo(1, 0),
    [RELATIVE_PERIOD_CODES.lastMonth]: () => monthUnitsAgo(1, 1),
    [RELATIVE_PERIOD_CODES.last3Months]: () => monthUnitsAgo(1, 3),
    [RELATIVE_PERIOD_CODES.last6Months]: () => monthUnitsAgo(1, 6),
    [RELATIVE_PERIOD_CODES.last12Months]: () => monthUnitsAgo(1, 12),
    [RELATIVE_PERIOD_CODES.monthsThisYear]: () => startOfYear(),
    [RELATIVE_PERIOD_CODES.thisBimonth]: () => monthUnitsAgo(2, 0),
    [RELATIVE_PERIOD_CODES.lastBimonth]: () => monthUnitsAgo(2, 1),
    [RELATIVE_PERIOD_CODES.last6BiMonths]: () => monthUnitsAgo(2, 6),
    [RELATIVE_PERIOD_CODES.biMonthsThisYear]: () => startOfYear(),
    [RELATIVE_PERIOD_CODES.thisQuarter]: () => monthUnitsAgo(3, 0),
    [RELATIVE_PERIOD_CODES.lastQuarter]: () => monthUnitsAgo(3, 1),
    [RELATIVE_PERIOD_CODES.last4Quarters]: () => monthUnitsAgo(3, 4),
    [RELATIVE_PERIOD_CODES.quartersThisYear]: () => startOfYear(),
    [RELATIVE_PERIOD_CODES.thisSixMonth]: () => monthUnitsAgo(6, 0),
    [RELATIVE_PERIOD_CODES.lastSixMonth]: () => monthUnitsAgo(6, 1),
    [RELATIVE_PERIOD_CODES.last2SixMonths]: () => monthUnitsAgo(6, 2),
    [RELATIVE_PERIOD_CODES.thisFinancialYear]: () => yearsAgo(0, true),
    [RELATIVE_PERIOD_CODES.lastFinancialYear]: () => yearsAgo(1, true),
    [RELATIVE_PERIOD_CODES.last5FinancialYears]: () => yearsAgo(5, true),
    [RELATIVE_PERIOD_CODES.thisYear]: () => yearsAgo(0),
    [RELATIVE_PERIOD_CODES.lastYear]: () => yearsAgo(1),
    [RELATIVE_PERIOD_CODES.last5Years]: () => yearsAgo(5),
}

export const getRelativePeriodStartDate = periodCode => {
    const startDateCalutator = startDateCalculators[periodCode]

    if (!startDateCalutator) {
        return null
    }

    return formatYyyyMmDd(startDateCalutator())
}
