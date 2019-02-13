import * as FEEDBACK_TYPES from '../../utils/feedbackTypes'
export const ACTION_TYPES = {
    FEEDBACK_CLEAR: 'FEEDBACK_CLEAR',
    FEEDBACK_SHOW_LOADER: 'FEEDBACK_SHOW_LOADER',
    FEEDBACK_SHOW_SNACKBAR: 'FEEDBACK_SHOW_SNACKBAR',
}

export const clearFeedback = () => ({
    type: ACTION_TYPES.FEEDBACK_CLEAR,
})

export const showLoader = () => ({
    type: ACTION_TYPES.FEEDBACK_SHOW_LOADER,
})

export const showSnackbar = (
    message,
    type = FEEDBACK_TYPES.ACTION_MESSAGE
) => ({
    type: ACTION_TYPES.FEEDBACK_SHOW_SNACKBAR,
    payload: { message, type },
})

export const showSuccessSnackBar = message =>
    showSnackbar(message, FEEDBACK_TYPES.SUCCESS)

export const showErrorSnackBar = message =>
    showSnackbar(message, FEEDBACK_TYPES.ERROR)

export const showWarningSnackBar = message =>
    showSnackbar(message, FEEDBACK_TYPES.WARNING)

// TODO: remove this
export const updateFeedbackState = () => ({})
