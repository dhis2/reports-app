import { ACTION_TYPES as ACTIONS } from '../actions/periodTypes'
import { staticList as initialState } from '../../utils/defaults'

export default function periodTypes(state = initialState, { type, payload }) {
    switch (type) {
        case ACTIONS.PERIOD_TYPES_RECEIVED:
            return {
                ...state,
                ready: true,
                collection: payload,
            }
        case ACTIONS.PERIOD_TYPES_ERRORED:
            return {
                ...state,
                ready: true,
                loadingError: payload,
            }
        default:
            return state
    }
}
