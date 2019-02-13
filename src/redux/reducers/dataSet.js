import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/dataSet'

export const defaultSelected = { id: '', displayName: '' }
export const defaultState = {
    ready: false,
    selected: defaultSelected,
    options: [],
    dimensionOptions: [],
    selectedDimensionOptions: {},
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
                ready: true,
                loading: false,
                options: payload,
            }

        case actionTypes.LOADING_DATA_SET_OPTIONS_ERROR:
            return {
                ...state,
                ready: false,
                loading: false,
                options: [],
                selected: { id: '', displayName: '' },
                loadingError: payload,
            }

        case actionTypes.LOADING_DIMENSIONS_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                dimensionOptions: [],
            }

        case actionTypes.LOADING_DIMENSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                dimensionOptions: payload,
            }

        case actionTypes.LOADING_DIMENSIONS_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
            }

        case actionTypes.SELECT_DIMENSION_OPTION:
            return {
                ...state,
                selectedDimensionOptions: {
                    ...state.selectedDimensionOptions,
                    [payload.dimension]: payload.value,
                },
            }

        case LOCATION_CHANGE:
            return {
                ...state,
                options: [],
                selected: defaultSelected,
                dimensionOptions: [],
                selectedDimensionOptions: {},
            }

        default:
            return state
    }
}
