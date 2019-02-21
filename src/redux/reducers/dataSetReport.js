import { actionTypes } from '../actions/dataSetReport'

export const defaultState = {
    selectedUnitOnly: false,
}

export const dataSetReport = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.TOGGLE_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
            }

        default:
            return state
    }
}
