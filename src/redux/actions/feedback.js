export const ACTION_TYPE = {
    UPDATE_FEEDBACK_STATE: 'UPDATE_FEEDBACK_STATE',
};

export const updateFeedbackState = dispatch => (
    (showSnackbar = false, snackbarConf = {}) => {
        dispatch({
            type: ACTION_TYPE.UPDATE_FEEDBACK_STATE,
            showSnackbar,
            snackbarConf,
        });
    })
;
