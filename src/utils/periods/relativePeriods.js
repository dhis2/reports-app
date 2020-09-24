import i18n from '@dhis2/d2-i18n'
import { fixedPeriodTranslations } from './fixedPeriods'

export const RELATIVE_PERIODS = [
    {
        label: i18n.t('Days'),
        options: [
            {
                value: 'thisDay',
                label: i18n.t('Reporting day'),
            },
            {
                value: 'yesterday',
                label: i18n.t('Yesterday'),
            },
            {
                value: 'last3Days',
                label: i18n.t('Last 3 days'),
            },
            {
                value: 'last7Days',
                label: i18n.t('Last 7 days'),
            },
            {
                value: 'last14Days',
                label: i18n.t('Last 14 days'),
            },
        ],
    },
    {
        label: i18n.t('Weeks'),
        options: [
            {
                value: 'thisWeek',
                label: i18n.t('Reporting week'),
            },
            {
                value: 'lastWeek',
                label: i18n.t('Last Week'),
            },
            {
                value: 'last4Weeks',
                label: i18n.t('Last 2 weeks'),
            },
            {
                value: 'last12Weeks',
                label: i18n.t('Last 12 weeks'),
            },
            {
                value: 'last52Weeks',
                label: i18n.t('Last 52 weeks'),
            },
            {
                value: 'weeksThisYear',
                label: i18n.t('Weeks this year'),
            },
        ],
    },
    {
        label: i18n.t('Months'),
        options: [
            {
                value: 'thisMonth',
                label: i18n.t('Reporting month'),
            },
            {
                value: 'lastMonth',
                label: i18n.t('Last month'),
            },
            {
                value: 'last3Months',
                label: i18n.t('Last 3 months'),
            },
            {
                value: 'last6Months',
                label: i18n.t('Last 6 months'),
            },
            {
                value: 'last12Months',
                label: i18n.t('Last 12 months'),
            },
            {
                value: 'monthsThisYear',
                label: i18n.t('Months this year'),
            },
        ],
    },
    {
        label: i18n.t('Bi-months'),
        options: [
            {
                value: 'thisBimonth',
                label: i18n.t('Reporting bi-month'),
            },
            {
                value: 'lastBimonth',
                label: i18n.t('Last bi-month'),
            },
            {
                value: 'last6BiMonths',
                label: i18n.t('Last 6 bi-month'),
            },
            {
                value: 'biMonthsThisYear',
                label: i18n.t('Bi-months this year'),
            },
        ],
    },
    {
        label: i18n.t('Quarters'),
        options: [
            {
                value: 'thisQuarter',
                label: i18n.t('Reporting quarter'),
            },
            {
                value: 'lastQuarter',
                label: i18n.t('Last quarter'),
            },
            {
                value: 'last4Quarters',
                label: i18n.t('Last 4 quarters'),
            },
            {
                value: 'quartersThisYear',
                label: i18n.t('Quarters of reporting year'),
            },
        ],
    },
    {
        label: i18n.t('Six-Months'),
        options: [
            {
                value: 'thisSixMonth',
                label: i18n.t('Reporting six-month'),
            },
            {
                value: 'lastSixMonth',
                label: i18n.t('Last six-month'),
            },
            {
                value: 'last2SixMonths',
                label: i18n.t('Last 2 six-months'),
            },
        ],
    },
    {
        label: i18n.t('Financial Years'),
        options: [
            {
                value: 'thisFinancialYear',
                label: i18n.t('Reporting financial year'),
            },
            {
                value: 'lastFinancialYear',
                label: i18n.t('Last financial year'),
            },
            {
                value: 'last5FinancialYears',
                label: i18n.t('Last 5 financial years'),
            },
        ],
    },
    {
        label: i18n.t('Years'),
        options: [
            {
                value: 'thisYear',
                label: i18n.t('Reporting year'),
            },
            {
                value: 'lastYear',
                label: i18n.t('Last year'),
            },
            {
                value: 'last5Years',
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
