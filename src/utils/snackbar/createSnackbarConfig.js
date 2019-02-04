import i18n from '../../locales';
import { i18nKeys } from '../../i18n';
import { ACTION_MESSAGE } from '../../utils/feedbackSnackBarTypes';

const createSnackbarConfig = (state) => {
    if (state.standardReport.requestDelete) {
        return {
            type: ACTION_MESSAGE,
            message: state.standardReport.selectedReport.displayName,
            action: i18n.t(i18nKeys.messages.confirmDelete),
        };
    }

    return state.feedback.snackbarConf;
};

export default createSnackbarConfig;
