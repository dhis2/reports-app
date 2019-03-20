import i18n from '@dhis2/d2-i18n'

export const resourceTypes = {
    UPLOAD_FILE: 'UPLOAD_FILE',
    EXTERNAL_URL: 'EXTERNAL_URL',
}

export const resourceTypeOptions = [
    { value: resourceTypes.EXTERNAL_URL, label: i18n.t('External url') },
    { value: resourceTypes.UPLOAD_FILE, label: i18n.t('Upload file') },
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
