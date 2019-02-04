/* i18n */
import i18n from '../../utils/i18n/locales';
import { i18nKeys } from '../../utils/i18n/i18nKeys';

export const DOCUMENTS_ENDPOINT = 'documents';
export const FILE_RESOURCES_ENDPOINT = 'fileResources';

export const ADD_NEW_RESOURCE_ACTION = 'ADD_NEW_RESOURCE_ACTION';

export const TYPES = {
    UPLOAD_FILE: 'UPLOAD_FILE',
    EXTERNAL_URL: 'EXTERNAL_URL',
};

export const RESOURCE_TYPES = [
    {
        id: TYPES.UPLOAD_FILE,
        name: i18n.t(i18nKeys.resource.uploadResourceType),
        external: false,
    },
    {
        id: TYPES.EXTERNAL_URL,
        name: i18n.t(i18nKeys.resource.externalResourceType),
        external: true,
    },
];

export const CONTEXT_MENU_ACTION = {
    VIEW: 'viewResource',
    EDIT: 'editResource',
    SHARING_SETTINGS: 'sharingSettings',
    DELETE: 'delete',
};

export const CONTEXT_MENU_ICONS = {
    [CONTEXT_MENU_ACTION.VIEW]: 'arrow_right',
    [CONTEXT_MENU_ACTION.EDIT]: 'edit',
    [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: 'people',
    [CONTEXT_MENU_ACTION.DELETE]: 'delete',
};
