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

        default:
            return state;
    }
};

export default feedback;
