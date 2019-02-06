import { ACTION_TYPES as ACTIONS } from '../actions/reportPeriod'

export const initialState = {
    ready: false,
    loadingError: '',
    collection: [],
    selectedPeriodType: null,
    selectedPeriod: null,
}

export default function reportPeriod(state = initialState, { type, payload }) {
    switch (type) {
        case ACTIONS.REPORT_PERIOD_TYPES_RECEIVED:
            return {
                ...state,
                ready: true,
                collection: payload,
            }
        case ACTIONS.REPORT_PERIOD_TYPES_ERRORED:
            return {
                ...state,
                ready: true,
                loadingError: payload,
            }
        case ACTIONS.REPORT_PERIOD_TYPE_SELECTED:
            console.log(payload)
            return {
                ...state,
                selectedPeriodType: payload,
            }
        case ACTIONS.REPORT_PERIOD_SELECTED:
            return {
                ...state,
                selectedPeriod: payload,
            }
        default:
            return state
    }
}
