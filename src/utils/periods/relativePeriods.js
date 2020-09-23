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
                id: RELATIVE_PERIOD_CODES.thisDay,
                name: i18n.t('Reporting day'),
            },
            {
                id: RELATIVE_PERIOD_CODES.yesterday,
                name: i18n.t('Yesterday'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last3Days,
                name: i18n.t('Last 3 days'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last7Days,
                name: i18n.t('Last 7 days'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last14Days,
                name: i18n.t('Last 14 days'),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t('Weeks'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisWeek,
                name: i18n.t('Reporting week'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastWeek,
                name: i18n.t('Last Week'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last4Weeks,
                name: i18n.t('Last 2 weeks'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last12Weeks,
                name: i18n.t('Last 12 weeks'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last52Weeks,
                name: i18n.t('Last 52 weeks'),
            },
            {
                id: RELATIVE_PERIOD_CODES.weeksThisYear,
                name: i18n.t('Weeks this year'),
            },
        ],
    },
    // Months
    {
        label: i18n.t('Months'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisMonth,
                name: i18n.t('Reporting month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastMonth,
                name: i18n.t('Last month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last3Months,
                name: i18n.t('Last 3 months'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last6Months,
                name: i18n.t('Last 6 months'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last12Months,
                name: i18n.t('Last 12 months'),
            },
            {
                id: RELATIVE_PERIOD_CODES.monthsThisYear,
                name: i18n.t('Months this year'),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t('Bi-months'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisBimonth,
                name: i18n.t('Reporting bi-month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastBimonth,
                name: i18n.t('Last bi-month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last6BiMonths,
                name: i18n.t('Last 6 bi-month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.biMonthsThisYear,
                name: i18n.t('Bi-months this year'),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t('Quarters'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisQuarter,
                name: i18n.t('Reporting quarter'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastQuarter,
                name: i18n.t('Last quarter'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last4Quarters,
                name: i18n.t('Last 4 quarters'),
            },
            {
                id: RELATIVE_PERIOD_CODES.quartersThisYear,
                name: i18n.t('Quarters of reporting year'),
            },
        ],
    },
    // Six-Months
    {
        label: i18n.t('Six-Months'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisSixMonth,
                name: i18n.t('Reporting six-month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastSixMonth,
                name: i18n.t('Last six-month'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last2SixMonths,
                name: i18n.t('Last 2 six-months'),
            },
        ],
    },
    // Financial years
    {
        label: i18n.t('Financial Years'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisFinancialYear,
                name: i18n.t('Reporting financial year'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastFinancialYear,
                name: i18n.t('Last financial year'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last5FinancialYears,
                name: i18n.t('Last 5 financial years'),
            },
        ],
    },
    // years
    {
        label: i18n.t('Years'),
        options: [
            {
                id: RELATIVE_PERIOD_CODES.thisYear,
                name: i18n.t('Reporting year'),
            },
            {
                id: RELATIVE_PERIOD_CODES.lastYear,
                name: i18n.t('Last year'),
            },
            {
                id: RELATIVE_PERIOD_CODES.last5Years,
                name: i18n.t('Last 5 years'),
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
    const y = date.getFullYear()
    let m = String(date.getMonth() + 1)
    let d = String(date.getDate())

    m = m.length < 2 ? `0${m}` : m
    d = d.length < 2 ? `0${d}` : d

    return `${y}-${m}-${d}`
}

const getCurrentDate = () => new Date(Date.now())

const daysAgo = offset => {
    const now = getCurrentDate()

    return now.setDate(now.getDate() - offset)
}

const weeksAgo = offset => {
    // const now = getCurrentDate()

    // Calculate the first date of an EPI year base on ISO standard  ( first week always contains 4th Jan )
    // const jan4 = new Date(now.getFullYear(), 0, 4)
    // const firstMondayOfYear = jan4.setDate(jan4.getDate() - jan4.getDay())

    // const mondayOfCurrentWeek = now.setDate(now.getDate() - now.getDay())
    // const currentWeekNumber
    return offset
}

// const weeksThisYear = () => {
//     const now = get
// }

const startDateCalculators = {
    thisDay: () => daysAgo(0),
    yesterday: () => daysAgo(1),
    last3Days: () => daysAgo(3),
    last7Days: () => daysAgo(7),
    last14Days: () => daysAgo(14),
    thisWeek: () => weeksAgo(0),
    lastWeek: () => weeksAgo(1),
    last4Weeks: () => '',
    last12Weeks: () => '',
    last52Weeks: () => '',
    weeksThisYear: () => '',
    thisMonth: () => '',
    lastMonth: () => '',
    last3Months: () => '',
    last6Months: () => '',
    last12Months: () => '',
    monthsThisYear: () => '',
    thisBimonth: () => '',
    lastBimonth: () => '',
    last6BiMonths: () => '',
    biMonthsThisYear: () => '',
    thisQuarter: () => '',
    lastQuarter: () => '',
    last4Quarters: () => '',
    quartersThisYear: () => '',
    thisSixMonth: () => '',
    lastSixMonth: () => '',
    last2SixMonths: () => '',
    thisFinancialYear: () => '',
    lastFinancialYear: () => '',
    last5FinancialYears: () => '',
    thisYear: () => '',
    lastYear: () => '',
    last5Years: () => '',
}

export const getRelativePeriodStartDate = periodCode => {
    const startDateCalutator = startDateCalculators[periodCode]
    const startTimestamp = startDateCalutator && startDateCalutator()

    return formatYyyyMmDd(startTimestamp)
}
