import omit from 'lodash.omit'
import { isRequiredWhen } from '../../utils/form/validators.js'
import {
    resourceActions,
    resourceTypes,
} from '../../utils/resource/constants.js'

export const showContextAction = (deleteResource) => (document, action) => {
    const access = document && document.access ? document.access : {}
    const actions = {
        [resourceActions.VIEW]: access.read,
        [resourceActions.SHARING_SETTINGS]: access.manage || access.externalize,
        [resourceActions.DELETE]: deleteResource,

        /**
         * This is currently not working on the backend for non-external documents
         * See the docs (docs/sections/resources.md) in this repo for more details
         */
        [resourceActions.EDIT]: access.update && document.external,
    }

    return actions[action] || false
}

export const extractFileAndFormattedResource = (values) => {
    const file =
        values.type === resourceTypes.UPLOAD_FILE && values.file
            ? values.file.file
            : null

    const resource = omit(values, 'file')
    const formattedResource = {
        ...resource,
        attachment: values.attachment === 'yes',
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
export const isTypeExternalUrl = (values) =>
    values.type === resourceTypes.EXTERNAL_URL

export const isTypeUploadFile = (values) =>
    values.type === resourceTypes.UPLOAD_FILE

export const isRequriedWhenTypeExternalUrl = isRequiredWhen(isTypeExternalUrl)

export const isRequriedWhenTypeUploadFile = isRequiredWhen(isTypeUploadFile)
