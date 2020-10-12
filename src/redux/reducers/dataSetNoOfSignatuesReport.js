import { actionTypes } from '../actions/dataSetNoOfSignatuesReport'

export const defaultSelected = { id: '', displayName: '' }
export const defaultState = {
    loading: false,
    selected: defaultSelected,
    noOfSignatures: [],
}

export const dataSetNoOfSignatuesReport = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.SELECT_NO_OF_SIGNATURES:
            return {
                ...state,
                selected: state.noOfSignatures.reduce(
                    (curSelected, cur) =>
                        cur.id === payload ? cur : curSelected,
                    { id: '', displayName: '' }
                ),
            }
        case actionTypes.LOADING_NUMBER_OF_SIGNATURES:
            return {
                ...state,
                loading: true,
                loadingError: '',
                noOfSignatures: [],
            }

        case actionTypes.LOADING_NUMBER_OF_SIGNATURES_SUCCESS:
            return {
                ...state,
                loading: false,
                noOfSignatures: payload,
            }

        default:
            return state
    }
}
