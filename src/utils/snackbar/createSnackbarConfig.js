import i18n from '@dhis2/d2-i18n'
import { ACTION_MESSAGE } from '../../utils/feedbackTypes.js'

const action = i18n.t('Confirm delete')
const createSnackbarConfig = (state) => {
    if (state.standardReport.requestDelete) {
        return {
            type: ACTION_MESSAGE,
            message: state.standardReport.selectedReport.displayName,
            action,
        }
    }

    return state.feedback.snackbarConf
}

export default createSnackbarConfig
