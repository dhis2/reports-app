import { LOCATION_CHANGE } from 'connected-react-router'
import { ACTION_TYPES } from '../actions/reportPeriod'

export const ACTIONS = { LOCATION_CHANGE, ...ACTION_TYPES }
export const initialState = {
    ready: false,
    loadingError: '',
    collection: [],
    selectedPeriodType: '',
    selectedPeriod: '',
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
                selectedPeriod: '',
            }

        case ACTIONS.REPORT_PERIOD_SELECTED:
            return {
                ...state,
                selectedPeriod: payload,
            }

        case ACTIONS.LOCATION_CHANGE:
            return {
                ...state,
                selectedPeriodType: '',
                selectedPeriod: '',
            }

        default:
            return state
    }
}
