import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/reportData'

export const defaultState = {
    loading: false,
    content: {},
    comment: '',
}

export const reportData = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.LOADING_REPORT_DATA_START:
            return {
                ...state,
                loading: true,
                content: {},
            }

        case actionTypes.LOADING_REPORT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                content: payload,
            }

        case actionTypes.LOADING_REPORT_DATA_ERROR:
            return {
                ...state,
                loading: false,
            }

        // @TODO: not sure this is needed.
        // Not required for reporting-rate-summary
        case actionTypes.UNSET_REPORT_DATA:
            return {
                ...state,
                content: {},
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
