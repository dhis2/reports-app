import { actionTypes } from '../actions/orgUnitDistReport'

export const initialState = {
    shouldShowChart: false,
}

export const orgUnitDistReport = (state = initialState, { type } = {}) => {
    switch (type) {
        case actionTypes.SET_TABULAR_OUTPUT:
            return { shouldShowChart: false }

        case actionTypes.SET_CHART_OUTPUT:
            return { shouldShowChart: true }

        default:
            return state
    }
}
