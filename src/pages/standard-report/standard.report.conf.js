import i18n from '@dhis2/d2-i18n'

export const REPORTS_ENDPOINT = 'reports'
export const REPORT_TEMPLATES_ENDPOINT = 'reportTemplate'

export const CONTEXT_MENU_ACTION = {
    CREATE: 'createReport',
    EDIT: 'editReport',
    DELETE: 'delete',
    SHARING_SETTINGS: 'sharingSettings',
}

export const CONTEXT_MENU_ICONS = {
    [CONTEXT_MENU_ACTION.CREATE]: 'arrow_right',
    [CONTEXT_MENU_ACTION.EDIT]: 'edit',
    [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: 'people',
    [CONTEXT_MENU_ACTION.DELETE]: 'delete',
}

export const NONE = {
    id: 'none',
    name: i18n.t('[ None ]'),
}

export const TYPES = {
    JASPER_REPORT_TABLE: 'JASPER_REPORT_TABLE',
    JASPER_JDBC: 'JASPER_JDBC',
    HTML: 'HTML',
}

export const REPORT_MODE = {
    REPORT: 'report',
    REPORT_TABLE: 'table',
}

export const GET_REPORT_AS_ENDPOINT = {
    PDF: 'data.pdf',
    XLS: 'data.xls',
    HTML: 'data.html',
}

export const reportTypes = {
    JASPER_REPORT_TABLE: 'JASPER_REPORT_TABLE',
    JASPER_JDBC: 'JASPER_JDBC',
    HTML: 'HTML',
}

export const reportTypeOptions = [
    {
        value: reportTypes.JASPER_REPORT_TABLE,
        label: i18n.t('Jasper report with report table data source'),
    },
    {
        value: reportTypes.JASPER_JDBC,
        label: i18n.t('Jasper report with JDBC data source'),
    },
    {
        value: reportTypes.HTML,
        label: i18n.t('HTML report'),
    },
]

export const REPORT_TYPES = [
    {
        id: TYPES.JASPER_REPORT_TABLE,
        name: i18n.t('Jasper report with report table data source'),
    },
    {
        id: TYPES.JASPER_JDBC,
        name: i18n.t('Jasper report with JDBC data source'),
    },
    {
        id: TYPES.HTML,
        name: i18n.t('HTML report'),
    },
]

export const cacheStrategies = [
    {
        value: 'NO_CACHE',
        label: i18n.t('No cache'),
    },
    {
        value: 'RESPECT_SYSTEM_SETTING',
        label: i18n.t('Respect system setting'),
    },
    {
        value: 'CACHE_1_HOUR',
        label: i18n.t('Cache for one hour'),
    },
    {
        value: 'CACHE_6AM_TOMORROW',
        label: i18n.t('Cache until 6 AM tomorrow'),
    },
    {
        value: 'CACHE_TWO_WEEKS',
        label: i18n.t('Cache for two weeks'),
    },
]

export const CACHE_STRATEGIES = [
    {
        id: 'NO_CACHE',
        name: i18n.t('No cache'),
    },
    {
        id: 'RESPECT_SYSTEM_SETTING',
        name: i18n.t('Respect system setting'),
    },
    {
        id: 'CACHE_1_HOUR',
        name: i18n.t('Cache for one hour'),
    },
    {
        id: 'CACHE_6AM_TOMORROW',
        name: i18n.t('Cache until 6 AM tomorrow'),
    },
    {
        id: 'CACHE_TWO_WEEKS',
        name: i18n.t('Cache for two weeks'),
    },
]

export const relativePeriods = [
    // Days
    {
        label: i18n.t('Days'),
        periods: [
            {
                id: 'thisDay',
                name: i18n.t('Reporting day'),
            },
            {
                id: 'yesterday',
                name: i18n.t('Yesterday'),
            },
            {
                id: 'last3Days',
                name: i18n.t('Last 3 days'),
            },
            {
                id: 'last7Days',
                name: i18n.t('Last 7 days'),
            },
            {
                id: 'last14Days',
                name: i18n.t('Last 14 days'),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t('Weeks'),
        periods: [
            {
                id: 'thisWeek',
                name: i18n.t('Reporting week'),
            },
            {
                id: 'lastWeek',
                name: i18n.t('Last Week'),
            },
            {
                id: 'last4Weeks',
                name: i18n.t('Last 2 weeks'),
            },
            {
                id: 'last12Weeks',
                name: i18n.t('Last 12 weeks'),
            },
            {
                id: 'last52Weeks',
                name: i18n.t('Last 52 weeks'),
            },
            {
                id: 'weeksThisYear',
                name: i18n.t('Weeks this year'),
            },
        ],
    },
    // Months
    {
        label: i18n.t('Months'),
        periods: [
            {
                id: 'thisMonth',
                name: i18n.t('Reporting month'),
            },
            {
                id: 'lastMonth',
                name: i18n.t('Last month'),
            },
            {
                id: 'last3Months',
                name: i18n.t('Last 3 months'),
            },
            {
                id: 'last6Months',
                name: i18n.t('Last 6 months'),
            },
            {
                id: 'last12Months',
                name: i18n.t('Last 12 months'),
            },
            {
                id: 'monthsThisYear',
                name: i18n.t('Months this year'),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t('Bi-months'),
        periods: [
            {
                id: 'thisBimonth',
                name: i18n.t('Reporting bi-month'),
            },
            {
                id: 'lastBimonth',
                name: i18n.t('Last bi-month'),
            },
            {
                id: 'last6BiMonths',
                name: i18n.t('Last 6 bi-month'),
            },
            {
                id: 'biMonthsThisYear',
                name: i18n.t('Bi-months this year'),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t('Quarters'),
        periods: [
            {
                id: 'thisQuarter',
                name: i18n.t('Reporting quarter'),
            },
            {
                id: 'lastQuarter',
                name: i18n.t('Last quarter'),
            },
            {
                id: 'last4Quarters',
                name: i18n.t('Last 4 quarters'),
            },
            {
                id: 'quartersThisYear',
                name: i18n.t('Quarters of reporting year'),
            },
        ],
    },
    // Six-Months
    {
        label: i18n.t('Six-Months'),
        periods: [
            {
                id: 'thisSixMonth',
                name: i18n.t('Reporting six-month'),
            },
            {
                id: 'lastSixMonth',
                name: i18n.t('Last six-month'),
            },
            {
                id: 'last2SixMonths',
                name: i18n.t('Last 2 six-months'),
            },
        ],
    },
    // Financial years
    {
        label: i18n.t('Financial Years'),
        periods: [
            {
                id: 'thisFinancialYear',
                name: i18n.t('Reporting financial year'),
            },
            {
                id: 'lastFinancialYear',
                name: i18n.t('Last financial year'),
            },
            {
                id: 'last5FinancialYears',
                name: i18n.t('Last 5 financial years'),
            },
        ],
    },
    // years
    {
        label: i18n.t('Years'),
        periods: [
            {
                id: 'thisYear',
                name: i18n.t('Reporting year'),
            },
            {
                id: 'lastYear',
                name: i18n.t('Last year'),
            },
            {
                id: 'last5Years',
                name: i18n.t('Last 5 years'),
            },
        ],
    },
]
