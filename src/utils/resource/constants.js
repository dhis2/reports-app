import i18n from '../i18n/locales'
import { i18nKeys } from '../i18n/i18nKeys'

export const types = {
    UPLOAD_FILE: 'UPLOAD_FILE',
    EXTERNAL_URL: 'EXTERNAL_URL',
}

export const options = [
    {
        id: types.UPLOAD_FILE,
        name: i18n.t(i18nKeys.resource.uploadResourceType),
        external: false,
    },
    {
        id: types.EXTERNAL_URL,
        name: i18n.t(i18nKeys.resource.externalResourceType),
        external: true,
    },
]

export const resourceActions = {
    NEW: 'newResource',
    VIEW: 'viewResource',
    EDIT: 'editResource',
    SHARING_SETTINGS: 'sharingSettings',
    DELETE: 'delete',
}

export const contextMenuIcons = {
    [resourceActions.VIEW]: 'arrow_right',
    [resourceActions.EDIT]: 'edit',
    [resourceActions.SHARING_SETTINGS]: 'people',
    [resourceActions.DELETE]: 'delete',
}
