import { actionTypes as standardReportActionTypes } from '../actions/standardReport';
import { ACTION_TYPE } from '../actions/feedback';

const initialState = {
    showSnackbar: false,
    snackbarConf: {
        type: '',
        message: '',
    },
};

const feedback = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPE.UPDATE_FEEDBACK_STATE:
            return {
                ...state,
                showSnackbar: action.showSnackbar,
                snackbarConf: { ...action.snackbarConf },
            };

        case standardReportActionTypes.REQUEST_DELETE_STANDARD_REPORT:
            return {
                ...state,
                showSnackbar: true,
                snackbarConf: {},
            };

        case ACTION_TYPE.CONFIRM_SNACKBAR_ACTION:
            return {
                ...state,
                showSnackbar: false,
            };

        default:
            return state;
    }
};

export default feedback;
