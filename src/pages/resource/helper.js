import omit from 'lodash.omit'

import { isRequiredWhen } from '../../utils/form/validators'
import { resourceActions, resourceTypes } from '../../utils/resource/constants'

export const showContextAction = deleteResource => (document, action) => {
    const access = document && document.access ? document.access : {}
    const actions = {
        [resourceActions.VIEW]: access.read,
        [resourceActions.EDIT]: access.update,
        [resourceActions.SHARING_SETTINGS]: access.manage || access.externalize,
        [resourceActions.DELETE]: deleteResource,
    }

    return actions[action] || false
}

export const extractFileAndFormattedResource = values => {
    const file =
        values.type === resourceTypes.UPLOAD_FILE ? values.file.file : null

    const resource = omit(values, 'file')
    const formattedResource = {
        ...resource,
        attachment: values.attachment === 'yes' ? true : false,
        external: values.type === resourceTypes.EXTERNAL_URL,
    }

    return {
        file,
        resource: formattedResource,
    }
}

/**
 *
 * Validation
 *
 */
export const isTypeExternalUrl = values =>
    values.type === resourceTypes.EXTERNAL_URL

export const isTypeUploadFile = values =>
    values.type === resourceTypes.UPLOAD_FILE

export const isRequriedWhenTypeExternalUrl = isRequiredWhen(isTypeExternalUrl)

export const isRequriedWhenTypeUploadFile = isRequiredWhen(isTypeUploadFile)
