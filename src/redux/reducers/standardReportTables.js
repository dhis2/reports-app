import { actionTypes } from '../actions/standardReportTables'

export const defaultState = {
    loading: false,
    error: '',
    collection: [],
    noMatches: false,
    searchTerm: '',
}

export const standardReportTables = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.STANDARD_REPORT_TABLES_SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: payload,
                noMatches: false,
            }

        case actionTypes.STANDARD_REPORT_TABLES_CLEAR_SEARCH_TERM:
            return {
                ...state,
                searchTerm: '',
                collection: [],
                noMatches: false,
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
                noMatches: payload.length === 0,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_ERROR:
            return {
                ...state,
                loading: false,
                noMatches: false,
            }

        default:
            return state
    }
}
