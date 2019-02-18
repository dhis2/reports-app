import { actionTypes } from '../actions/reportingRateSummary'

export const defaultState = {
    showForm: true,
}

export const reportingRateSummary = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.SET_SHOW_FORM:
            return { ...state, showForm: payload }

        default:
            return state
    }
}
