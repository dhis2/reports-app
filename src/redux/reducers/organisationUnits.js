import { LOCATION_CHANGE } from 'connected-react-router'
import { ACTION_TYPES } from '../actions/organisationUnits'

export const ACTIONS = { LOCATION_CHANGE, ...ACTION_TYPES }
export const initialState = {
    loading: true,
    collection: [],
    selected: null,
    selectedOptions: {},
    showOptions: false,
}

export default function organisationUnits(
    state = initialState,
    { type, payload }
) {
    switch (type) {
        case ACTIONS.ORGANISATION_UNITS_RECEIVED:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case ACTIONS.ORGANISATION_UNITS_ERRORED:
            return {
                ...state,
                loading: false,
            }

        case ACTIONS.ORGANISATION_UNIT_SELECTED:
            if (state.selected && state.selected.id === payload.id) {
                return state
            }
            return {
                ...state,
                selected: payload,
            }

        case ACTIONS.ORGANISATION_UNITS_OPTION_SELECTED:
            return {
                ...state,
                selectedOptions: {
                    ...state.selectedOptions,
                    [payload.id]: payload.value,
                },
            }

        case ACTIONS.TOGGLE_SHOW_OPTIONS:
            return {
                ...state,
                showOptions: !state.showOptions,
            }

        case ACTIONS.LOCATION_CHANGE:
            return {
                ...initialState,
                loading: false,
                collection: state.collection,
            }

        default:
            return state
    }
}
