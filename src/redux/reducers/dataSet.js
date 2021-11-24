import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/dataSet.js'

export const defaultSelected = { id: '', displayName: '' }
export const defaultState = {
    loading: false,
    selected: defaultSelected,
    options: [],
}

export const dataSet = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.SELECT_DATA_SET:
            return {
                ...state,
                selected: state.options.reduce(
                    (curSelected, cur) =>
                        cur.id === payload ? cur : curSelected,
                    { id: '', displayName: '' }
                ),
            }

        case actionTypes.LOADING_DATA_SET_OPTIONS_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                options: [],
            }

        case actionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                options: payload,
            }

        case actionTypes.LOADING_DATA_SET_OPTIONS_ERROR:
            return {
                ...state,
                loading: false,
            }

        case LOCATION_CHANGE:
            return {
                ...state,
                selected: defaultSelected,
            }

        default:
            return state
    }
}
