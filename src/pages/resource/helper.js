import { resourceActions } from '../../utils/resource/constants'

export const showContextAction = (document, action) => {
    const access = document && document.access ? document.access : {}
    const actions = {
        [resourceActions.VIEW]: access.read,
        [resourceActions.EDIT]: access.update,
        [resourceActions.SHARING_SETTINGS]: access.manage || access.externalize,
        [resourceActions.DELETE]: this.props.deleteResource,
    }

    return actions[action] || false
}
