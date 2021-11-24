import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/organisationUnits.js'

export const ACTIONS = { LOCATION_CHANGE, ...actionTypes }
export const defaultState = {
    loading: true,
    collection: [],
    selected: null,
    selectedOptions: {},
    showOptions: false,
}

export function organisationUnits(state = defaultState, { type, payload }) {
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

        case ACTIONS.ORGANISATION_UNIT_CLEARED:
        case ACTIONS.LOCATION_CHANGE:
            return {
                ...defaultState,
                loading: false,
                collection: state.collection,
            }

        default:
            return state
    }
}
