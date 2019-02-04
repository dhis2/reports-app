/* i18n */
import i18n from '../../utils/i18n/locales'
import { i18nKeys } from '../../utils/i18n/i18nKeys'

export const REPORTS_ENDPOINT = 'reports'
export const REPORT_TABLES_ENDPOINT = 'reportTables'

export const ADD_NEW_REPORT_ACTION = 'ADD_NEW_REPORT_ACTION'

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
    name: i18n.t(i18nKeys.standardReport.none),
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

export const REPORT_TYPES = [
    {
        id: TYPES.JASPER_REPORT_TABLE,
        name: i18n.t(i18nKeys.standardReport.jasperReportTable),
    },
    {
        id: TYPES.JASPER_JDBC,
        name: i18n.t(i18nKeys.standardReport.jasperJDBCReportType),
    },
    {
        id: TYPES.HTML,
        name: i18n.t(i18nKeys.standardReport.htmlReportType),
    },
]

export const CACHE_STRATEGIES = [
    {
        id: 'NO_CACHE',
        name: i18n.t(i18nKeys.standardReport.noCache),
    },
    {
        id: 'RESPECT_SYSTEM_SETTING',
        name: i18n.t(i18nKeys.standardReport.respectSystemSettings),
    },
    {
        id: 'CACHE_1_HOUR',
        name: i18n.t(i18nKeys.standardReport.cacheForOneHour),
    },
    {
        id: 'CACHE_6AM_TOMORROW',
        name: i18n.t(i18nKeys.standardReport.cache6AmTomorrow),
    },
    {
        id: 'CACHE_TWO_WEEKS',
        name: i18n.t(i18nKeys.standardReport.cacheFour2Weeks),
    },
]

export const relativePeriods = [
    // Days
    {
        label: i18n.t(i18nKeys.relativePeriods.days),
        periods: [
            {
                id: 'thisDay',
                name: i18n.t(i18nKeys.relativePeriods.thisDay),
            },
            {
                id: 'yesterday',
                name: i18n.t(i18nKeys.relativePeriods.yesterday),
            },
            {
                id: 'last3Days',
                name: i18n.t(i18nKeys.relativePeriods.last3Days),
            },
            {
                id: 'last7Days',
                name: i18n.t(i18nKeys.relativePeriods.last7Days),
            },
            {
                id: 'last14Days',
                name: i18n.t(i18nKeys.relativePeriods.last14Days),
            },
        ],
    },
    // Weeks
    {
        label: i18n.t(i18nKeys.relativePeriods.weeks),
        periods: [
            {
                id: 'thisWeek',
                name: i18n.t(i18nKeys.relativePeriods.thisWeek),
            },
            {
                id: 'lastWeek',
                name: i18n.t(i18nKeys.relativePeriods.lastWeek),
            },
            {
                id: 'last4Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last4Weeks),
            },
            {
                id: 'last12Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last12Weeks),
            },
            {
                id: 'last52Weeks',
                name: i18n.t(i18nKeys.relativePeriods.last52Weeks),
            },
            {
                id: 'weeksThisYear',
                name: i18n.t(i18nKeys.relativePeriods.weeksThisYear),
            },
        ],
    },
    // Months
    {
        label: i18n.t(i18nKeys.relativePeriods.months),
        periods: [
            {
                id: 'thisMonth',
                name: i18n.t(i18nKeys.relativePeriods.thisMonth),
            },
            {
                id: 'lastMonth',
                name: i18n.t(i18nKeys.relativePeriods.lastMonth),
            },
            {
                id: 'last3Months',
                name: i18n.t(i18nKeys.relativePeriods.last3Months),
            },
            {
                id: 'last6Months',
                name: i18n.t(i18nKeys.relativePeriods.last6Months),
            },
            {
                id: 'last12Months',
                name: i18n.t(i18nKeys.relativePeriods.last12Months),
            },
            {
                id: 'monthsThisYear',
                name: i18n.t(i18nKeys.relativePeriods.monthsThisYear),
            },
        ],
    },
    // Bi-months
    {
        label: i18n.t(i18nKeys.relativePeriods.biMonths),
        periods: [
            {
                id: 'thisBimonth',
                name: i18n.t(i18nKeys.relativePeriods.thisBimonth),
            },
            {
                id: 'lastBimonth',
                name: i18n.t(i18nKeys.relativePeriods.lastBimonth),
            },
            {
                id: 'last6BiMonths',
                name: i18n.t(i18nKeys.relativePeriods.last6BiMonths),
            },
            {
                id: 'biMonthsThisYear',
                name: i18n.t(i18nKeys.relativePeriods.biMonthsThisYear),
            },
        ],
    },
    // Quarters
    {
        label: i18n.t(i18nKeys.relativePeriods.quarters),
        periods: [
            {
                id: 'thisQuarter',
                name: i18n.t(i18nKeys.relativePeriods.thisQuarter),
            },
            {
                id: 'lastQuarter',
                name: i18n.t(i18nKeys.relativePeriods.lastQuarter),
            },
            {
                id: 'last4Quarters',
                name: i18n.t(i18nKeys.relativePeriods.last4Quarters),
            },
            {
                id: 'quartersThisYear',
                name: i18n.t(i18nKeys.relativePeriods.quartersThisYear),
            },
        ],
    },
    // Six-Months
    {
        label: i18n.t(i18nKeys.relativePeriods.sixMonths),
        periods: [
            {
                id: 'thisSixMonth',
                name: i18n.t(i18nKeys.relativePeriods.thisSixMonth),
            },
            {
                id: 'lastSixMonth',
                name: i18n.t(i18nKeys.relativePeriods.lastSixMonth),
            },
            {
                id: 'last2SixMonths',
                name: i18n.t(i18nKeys.relativePeriods.last2SixMonths),
            },
        ],
    },
    // Financial years
    {
        label: i18n.t(i18nKeys.relativePeriods.financialYears),
        periods: [
            {
                id: 'thisFinancialYear',
                name: i18n.t(i18nKeys.relativePeriods.thisFinancialYear),
            },
            {
                id: 'lastFinancialYear',
                name: i18n.t(i18nKeys.relativePeriods.lastFinancialYear),
            },
            {
                id: 'last5FinancialYears',
                name: i18n.t(i18nKeys.relativePeriods.last5FinancialYears),
            },
        ],
    },
    // years
    {
        label: i18n.t(i18nKeys.relativePeriods.years),
        periods: [
            {
                id: 'thisYear',
                name: i18n.t(i18nKeys.relativePeriods.thisYear),
            },
            {
                id: 'lastYear',
                name: i18n.t(i18nKeys.relativePeriods.lastYear),
            },
            {
                id: 'last5Years',
                name: i18n.t(i18nKeys.relativePeriods.last5Years),
            },
        ],
    },
]
