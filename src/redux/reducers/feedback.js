import { ACTION_TYPES as TYPES } from '../actions/feedback'

export const initialState = {
    showSnackbar: false,
    showLoader: false,
    message: '',
    type: '',
}

const feedback = (state = initialState, { type, payload }) => {
    switch (type) {
        case TYPES.FEEDBACK_CLEAR:
            return initialState

        case TYPES.FEEDBACK_SHOW_LOADER:
            return {
                ...state,
                showLoader: true,
            }

        case TYPES.FEEDBACK_SHOW_SNACKBAR:
            return {
                ...state,
                ...payload,
                showSnackbar: true,
            }

        default:
            return state
    }
}

export default feedback
