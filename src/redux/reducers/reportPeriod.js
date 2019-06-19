import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/reportPeriod'

export const ACTIONS = { LOCATION_CHANGE, ...actionTypes }
export const defaultState = {
    loading: true,
    collection: [],
    selectedPeriodType: '',
    selectedPeriod: '',
}

export function reportPeriod(state = defaultState, { type, payload }) {
    switch (type) {
        case ACTIONS.REPORT_PERIOD_TYPES_RECEIVED:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case ACTIONS.REPORT_PERIOD_TYPES_ERRORED:
            return {
                ...state,
                loading: false,
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

        case ACTIONS.REPORT_PERIOD_CLEAR_ALL:
        case ACTIONS.LOCATION_CHANGE:
            return {
                ...defaultState,
                loading: state.loading,
                collection: state.collection,
            }

        default:
            return state
    }
}
