import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/dataSetDimensions.js'

const removeKeyFromObj = (obj, removeKey) => {
    // eslint-disable-next-line no-unused-vars
    const { [removeKey]: remove, ...remainingKeys } = obj
    return remainingKeys
}

export const defaultState = {
    loading: false,
    options: [],
    selected: {},
}

export const dataSetDimensions = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.LOADING_DIMENSIONS_START:
            return {
                ...state,
                loading: true,
                options: [],
            }

        case actionTypes.LOADING_DIMENSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                options: payload,
            }

        case actionTypes.LOADING_DIMENSIONS_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.SELECT_DIMENSION_OPTION:
            return payload.value
                ? {
                      ...state,
                      selected: {
                          ...state.selected,
                          [payload.dimension]: payload.value,
                      },
                  }
                : {
                      ...state,
                      selected: removeKeyFromObj(
                          state.selected,
                          payload.dimension
                      ),
                  }

        case LOCATION_CHANGE:
            return {
                ...defaultState,
            }

        default:
            return state
    }
}
