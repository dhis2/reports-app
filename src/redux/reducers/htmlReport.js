import { actionTypes } from '../actions/htmlReport'

export const defaultState = {
    loading: false,
    loadingError: '',
    reportHtml: '',
}

export const htmlReport = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.LOADING_HTML_REPORT_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                reportHtml: '',
            }

        case actionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                reportHtml: payload,
            }

        case actionTypes.LOADING_HTML_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
            }

        default:
            return state
    }
}
