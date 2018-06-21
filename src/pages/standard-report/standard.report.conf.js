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
        name: 'Jasper report with report table data source',
    },
    {
        id: 'JASPER_JDBC',
        name: 'Jasper report with JDBC data source',
    },
    {
        id: 'HTML',
        name: 'HTML report',
    },
];

export const CACHE_STATEGIES = [
    {
        id: 'NO_CACHE',
        name: 'No cache',
    },
    {
        id: 'RESPECT_SYSTEM_SETTING',
        name: 'Respect system setting',
    },
    {
        id: 'CACHE_1_HOUR',
        name: 'Cache for one hour',
    },
    {
        id: 'CACHE_6AM_TOMORROW',
        name: 'Cache until 6 AM tomorrow',
    },
    {
        id: 'CACHE_TWO_WEEKS',
        name: 'Cache for two weeks',
    },
];
