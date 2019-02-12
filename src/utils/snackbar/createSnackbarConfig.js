import i18n from '../../utils/i18n/locales'
import { i18nKeys } from '../../utils/i18n/i18nKeys'
import { ACTION_MESSAGE } from '../../utils/feedbackTypes.js'

const createSnackbarConfig = state => {
    if (state.standardReport.requestDelete) {
        return {
            type: ACTION_MESSAGE,
            message: state.standardReport.selectedReport.displayName,
            action: i18n.t(i18nKeys.messages.confirmDelete),
        }
    }

    return state.feedback.snackbarConf
}

export default createSnackbarConfig
