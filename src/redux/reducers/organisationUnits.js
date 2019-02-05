import { ACTION_TYPES as ACTIONS } from '../actions/organisationUnits'

export default function organisationUnits(state = null, { type, payload }) {
    switch (type) {
        case ACTIONS.ORGANISATION_UNITS_RECEIVED:
        case ACTIONS.ORGANISATION_UNITS_ERRORED:
            return payload
        default:
            return state
    }
}
