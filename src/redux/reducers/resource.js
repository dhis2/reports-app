import { actionTypes } from '../actions/resource'

export const defaultState = {
    loading: false,
    collection: [],
}

export const resource = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.LOADING_RESOURCES_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.LOADING_RESOURCES_SUCCESS:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case actionTypes.LOADING_RESOURCES_ERROR:
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}
