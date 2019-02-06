export const ACTION_TYPE = {
    UPDATE_FEEDBACK_STATE: 'UPDATE_FEEDBACK_STATE',
}

export const updateFeedbackState = (
    showSnackbar = false,
    snackbarConf = {}
) => ({
    type: ACTION_TYPE.UPDATE_FEEDBACK_STATE,
    showSnackbar,
    snackbarConf,
})
