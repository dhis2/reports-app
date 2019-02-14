import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/htmlReport'

export const defaultState = {
    content: '',
    comment: '',
}

export const htmlReport = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.LOADING_HTML_REPORT_START:
            return {
                ...state,
                content: '',
            }

        case actionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
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

        case LOCATION_CHANGE:
            return defaultState

        default:
            return state
    }
}
