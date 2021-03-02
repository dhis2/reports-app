import { actionTypes } from '../actions/standardReportTables'

export const defaultState = {
    loading: false,
    error: '',
    collection: [],
    searchTerm: '',
}

export const standardReportTables = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.STANDARD_REPORT_TABLES_SET_FILTER:
            return {
                ...state,
                searchTerm: payload,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_START:
            return {
                ...state,
                error: '',
                loading: true,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                error: '',
                collection: payload,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                error: payload,
            }

        default:
            return state
    }
}
