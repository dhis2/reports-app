import { CONTEXT_MENU_ACTION } from './standard.report.conf'

const hasNextPageCreator = (page, pageCount) => () => page < pageCount

const hasPreviousPageCreator = page => () => page > 1

/* Context Menu */
const displayNoResults = (reports, loading) =>
    reports.length > 0 || loading ? { display: 'none' } : ''

const showContextAction = (report, action) => {
    const access = report && report.access ? report.access : {}
    const actions = {
        [CONTEXT_MENU_ACTION.CREATE]: access.read,
        [CONTEXT_MENU_ACTION.EDIT]: access.update,
        [CONTEXT_MENU_ACTION.SHARING_SETTINGS]:
            access.manage || access.externalize,
        [CONTEXT_MENU_ACTION.DELETE]: access.delete,
    }
    return actions[action] || false
}

export {
    hasNextPageCreator,
    hasPreviousPageCreator,
    displayNoResults,
    showContextAction,
}
