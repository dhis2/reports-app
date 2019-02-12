import { actionTypes } from '../actions/htmlReport'

export const defaultState = {
    loading: false,
    loadingError: '',
    content: '',
    comment: '',
}

export const htmlReport = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.LOADING_HTML_REPORT_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                content: '',
            }

        case actionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                content: payload,
            }

        case actionTypes.LOADING_HTML_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
            }

        case actionTypes.SET_DATA_SET_REPORT_COMMENT:
            return {
                ...state,
                comment: payload,
            }

        default:
            return state
    }
}
