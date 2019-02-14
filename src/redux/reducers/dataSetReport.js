import { actionTypes } from '../actions/dataSetReport'
import { actionTypes as reportHtmlActionTypes } from '../actions/htmlReport'

export const defaultState = {
    showForm: true,
    selectedUnitOnly: false,
}

export const dataSetReport = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.SHOW_DATA_SET_REPORT_FORM:
            return { ...state, showForm: true }

        case reportHtmlActionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                showForm: false,
            }

        case actionTypes.TOGGLE_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
            }

        default:
            return state
    }
}
