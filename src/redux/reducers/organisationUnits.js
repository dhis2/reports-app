import { LOCATION_CHANGE } from 'connected-react-router'
import { ACTION_TYPES } from '../actions/organisationUnits'

export const ACTIONS = { LOCATION_CHANGE, ...ACTION_TYPES }
export const initialState = {
    ready: false,
    loadingError: '',
    collection: [],
    selected: null,
}

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

        case ACTIONS.ORGANISATION_UNIT_SELECTED:
            if (state.selected && state.selected.id === payload.id) {
                return state
            }
            return {
                ...state,
                selected: payload,
            }

        case ACTIONS.LOCATION_CHANGE:
            return {
                ...state,
                selected: null,
            }

        default:
            return state
    }
}
