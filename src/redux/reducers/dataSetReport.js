import { actionTypes } from '../actions/dataSetReport'
import { actionTypes as reportHtmlActionTypes } from '../actions/htmlReport'

const defaultState = {
    showForm: true,
    selectedUnitOnly: false,
}

const dataSetReport = (state = defaultState, action = {}) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.SHOW_DATA_SET_REPORT_FORM:
            return { ...state, showForm: true }

        case reportHtmlActionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                showForm: false,
            }

        case actionTypes.SET_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
            }

        default:
            return state
    }
}

export default dataSetReport
export { defaultState }
