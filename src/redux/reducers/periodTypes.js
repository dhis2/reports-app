import { ACTION_TYPES as ACTIONS } from '../actions/periodTypes'

export default function periodTypes(state = null, { type, payload }) {
    switch (type) {
        case ACTIONS.PERIOD_TYPES_RECEIVED:
        case ACTIONS.PERIOD_TYPES_ERRORED:
            return payload
        default:
            return state
    }
}
