import { actionTypes } from '../actions/dataSet'

export const defaultState = {
    ready: false,
    selected: { id: '', displayName: '' },
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

        default:
            return state
    }
}
