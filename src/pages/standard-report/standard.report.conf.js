/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export const REPORTS_ENDPOINT = 'reports';
export const REPORT_TABLES_ENDPOINT = 'reportTables';
export const FILE_RESOURCES_ENDPOINT = 'fileResources';

export const ADD_NEW_REPORT_ACTION = 'ADD_NEW_REPORT_ACTION';

export const CONTEXT_MENU_ACTION = {
    CREATE: 'CREATE',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    SHOW_DETAILS: 'SHOW_DETAILS',
    SHARING_SETTINGS: 'SHARING_SETTINGS',
};

export const CONTEXT_MENU_ICONS = {
    createReport: 'arrow_right',
    editReport: 'edit',
    sharingSettings: 'people',
    remove: 'delete',
    showDetails: 'info',
};

export const REPORT_TYPES = [
    {
        id: 'JASPER_REPORT_TABLE',
        name: i18n.t(i18nKeys.standardReport.jasperReportTable),
    },
    {
        id: 'JASPER_JDBC',
        name: i18n.t(i18nKeys.standardReport.jasperJDBCReportType),
    },
    {
        id: 'HTML',
        name: i18n.t(i18nKeys.standardReport.htmlReportType),
    },
];

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
];
