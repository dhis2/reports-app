import { actionTypes as types } from '../actions/feedback'

export const initialState = {
    showSnackbar: false,
    showLoader: false,
    message: '',
    type: '',
}

export const feedback = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.FEEDBACK_CLEAR:
            return initialState

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
