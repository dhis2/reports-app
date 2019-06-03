import { actionTypes as types } from '../actions/feedback'

export const defaultState = {
    showSnackbar: false,
    showLoader: false,
    message: '',
    type: '',
}

export const feedback = (state = defaultState, { type, payload }) => {
    switch (type) {
        case types.FEEDBACK_CLEAR:
            return defaultState

        case types.FEEDBACK_SHOW_LOADER:
            return {
                ...state,
                showLoader: true,
            }

        case types.FEEDBACK_SHOW_SNACKBAR:
            return {
                ...state,
                ...payload,
                showSnackbar: true,
                showLoader: false,
            }

        default:
            return state
    }
}
