import { LOCATION_CHANGE } from 'connected-react-router'
import { ACTION_TYPES } from '../actions/reportPeriod'

const ACTIONS = { LOCATION_CHANGE, ...ACTION_TYPES }
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
            return {
                ...state,
                selectedPeriodType: payload,
            }

        case ACTIONS.REPORT_PERIOD_SELECTED:
            return {
                ...state,
                selectedPeriod: payload,
            }

        case ACTIONS.LOCATION_CHANGE:
            return {
                ...state,
                selectedPeriodType: null,
                selectedPeriod: null,
            }

        default:
            return state
    }
}
