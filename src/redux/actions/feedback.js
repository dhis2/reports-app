import * as FEEDBACK_TYPES from '../utils/feedbackTypes'
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

export const showSuccessSnackBar = message => ({
    type: ACTION_TYPES.FEEDBACK_SHOW_SNACKBAR,
    payload: { message, type: FEEDBACK_TYPES.SUCCES },
})

export const showErrorSnackBar = message => ({
    type: ACTION_TYPES.FEEDBACK_SHOW_SNACKBAR,
    payload: { message, type: FEEDBACK_TYPES.ERROR },
})

export const showWarningSnackBar = message => ({
    type: ACTION_TYPES.FEEDBACK_SHOW_SNACKBAR,
    payload: { message, type: FEEDBACK_TYPES.WARNING },
})
