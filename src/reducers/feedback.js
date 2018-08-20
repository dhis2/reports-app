export const UPDATE_FEEDBACK_STATE = 'feedback/UPDATE_FEEDBACK_STATE';

const initialState = {
    showSnackbar: false,
    snackbarConf: {
        type: '',
        message: '',
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_FEEDBACK_STATE:
        return {
            ...state,
            showSnackbar: action.showSnackbar,
            snackbarConf: { ...action.snackbarConf },
        };
    default:
        return state;
    }
};

export const updateFeedbackState = (showSnackbar, snackbarConf = {}) => (dispatch) => {
    dispatch({
        type: UPDATE_FEEDBACK_STATE,
        showSnackbar,
        snackbarConf,
    });
};
