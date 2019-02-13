import { LOCATION_CHANGE } from 'connected-react-router'
import { ACTION_TYPES } from '../actions/organisationUnits'

export const ACTIONS = { LOCATION_CHANGE, ...ACTION_TYPES }
export const initialState = {
    ready: false,
    loadingError: '',
    collection: [],
    selected: null,
    selectedOptions: {},
    showOptions: false,
    groupSets: [],
    selectedGroupSet: '',
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

        case ACTIONS.LOADING_GROUP_SETS_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                groupSets: [],
            }

        case ACTIONS.LOADING_GROUP_SETS_SUCCESS:
            return {
                ...state,
                loading: false,
                groupSets: payload,
            }

        case ACTIONS.LOADING_GROUP_SETS_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
            }

        case ACTIONS.SET_GROUP_SET:
            return {
                ...state,
                selectedGroupSet: payload,
            }

        case ACTIONS.LOCATION_CHANGE:
            return {
                ...initialState,
                ready: true,
                collection: state.collection,
                groupSets: state.groupSets,
            }

        default:
            return state
    }
}
