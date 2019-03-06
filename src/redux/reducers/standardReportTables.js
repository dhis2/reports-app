import { actionTypes } from '../actions/standardReportTables'

export const defaultState = {
    loading: false,
    collection: [],
}

export const standardReportTables = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.STANDARD_REPORT_TABLES_LOADING_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case actionTypes.STANDARD_REPORT_TABLES_LOADING_ERROR:
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}
