import { actionTypes } from '../actions/dataSet'

export const defaultState = {
    selected: { id: '', displayName: '' },
}

export const dataSet = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.SELECT_DATA_SET:
            return {
                ...state,
                selected: payload,
            }

        default:
            return state
    }
}
