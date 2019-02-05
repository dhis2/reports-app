import { ACTION_TYPES as ACTIONS } from '../actions/organisationUnits'
import { staticList as initialState } from '../../utils/defaults'

export default function organisationUnits(
    state = initialState,
    { type, payload }
) {
    switch (type) {
        case ACTIONS.ORGANISATION_UNITS_RECEIVED:
            return {
                ...state,
                ready: true,
                collection: payload,
            }
        case ACTIONS.ORGANISATION_UNITS_ERRORED:
            return {
                ...state,
                ready: true,
                loadingError: payload,
            }
        default:
            return state
    }
}
