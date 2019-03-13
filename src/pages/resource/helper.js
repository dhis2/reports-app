import omit from 'lodash.omit'
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
    const resource =
        values.type === resourceTypes.UPLOAD_FILE
            ? omit(values, ['file', 'url'])
            : omit(values, ['file', 'attachment'])

    return { file, resource }
}
