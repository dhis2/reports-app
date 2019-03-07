import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/orgUnitGroupSets'

export const defaultState = {
    loading: false,
    collection: [],
    selected: '',
}

export function orgUnitGroupSets(state = defaultState, { type, payload } = {}) {
    switch (type) {
        case actionTypes.LOADING_GROUP_SETS_START:
            return {
                ...state,
                loading: true,
                collection: [],
            }

        case actionTypes.LOADING_GROUP_SETS_SUCCESS:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case actionTypes.LOADING_GROUP_SETS_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.SET_GROUP_SET:
            return {
                ...state,
                selected: payload,
            }

        case LOCATION_CHANGE:
            return {
                ...defaultState,
                collection: state.collection,
            }

        default:
            return state
    }
}
