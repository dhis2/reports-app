import { actionTypes } from '../actions/reportingRateSummary'

export const defaultState = {
    showForm: true,
    selectedCriteria: '',
}

export const reportingRateSummary = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.SET_SHOW_FORM:
            return { ...state, showForm: payload }

        case actionTypes.SET_SELECTED_CRITERIA:
            return { ...state, selectedCriteria: payload }

        default:
            return state
    }
}
