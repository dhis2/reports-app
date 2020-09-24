import i18n from '@dhis2/d2-i18n'
export { RELATIVE_PERIODS } from '../../utils/periods/relativePeriods'

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
