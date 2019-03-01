import i18n from '@dhis2/d2-i18n'

export const types = {
    UPLOAD_FILE: 'UPLOAD_FILE',
    EXTERNAL_URL: 'EXTERNAL_URL',
}

export const options = [
    {
        id: types.UPLOAD_FILE,
        name: i18n.t('Upload File'),
        external: false,
    },
    {
        id: types.EXTERNAL_URL,
        name: i18n.t('External URL'),
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
