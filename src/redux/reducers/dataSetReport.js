import { actionTypes } from '../actions/dataSetReport'
import { ERROR, LOADING, SUCCESS } from '../../utils/feedbackSnackBarTypes'
import i18n from '../../utils/i18n/locales'

const defaultState = {
    loading: false,
    showForm: true,
    showOptions: false,
    selectedUnitOnly: false,
    reportHtml: '',
    selectedPeriod: {},
    selectedDataSet: { id: '' },
    selectedOrgUnit: {},
    selectedOptionsForDimensions: {},
    selectedOptionsForOrganisationUnitGroupSets: {},
}

const dataSetReport = (state = defaultState, action = {}) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.SHOW_DATA_SET_REPORT_FORM:
            return { ...state, showForm: true }

        case actionTypes.LOADING_HTML_REPORT_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: {
                    type: LOADING,
                },
            }

        case actionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                reportHtml: payload,
                showForm: false,
                loadHtmlReport: false,
                showFeedback: true,
                feedbackConf: {
                    type: SUCCESS,
                    message: i18n.t('Report generated'),
                },
            }

        case actionTypes.LOADING_HTML_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
                showFeedback: true,
                feedbackConf: {
                    type: ERROR,
                    message: i18n.t("Report couldn't be generated"),
                },
            }

        case actionTypes.TOGGLE_SHOW_OPTIONS:
            return {
                ...state,
                showForm: !state.showForm,
            }

        case actionTypes.SELECT_ORG_UNIT:
            return {
                ...state,
                selectedOrgUnit: payload,
            }

        case actionTypes.SELECT_DATA_SET:
            return {
                ...state,
                selectedDataSet: payload,
                selectedOptionsForDimensions: {},
            }

        case actionTypes.SELECT_DIMENSION:
            return {
                ...state,
                selectedOptionsForDimensions: {
                    ...state.selectedOptionsForDimensions,
                    [payload.dimension]: payload.value,
                },
            }

        case actionTypes.SELECT_PERIOD:
            return {
                ...state,
                selectedPeriod: payload,
            }

        case actionTypes.SET_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
            }

        case actionTypes.SELECT_OPTIONS_FOR_ORGANISATION_UNIT_GROUP_SETS:
            return {
                ...state,
                selectedOptionsForOrganisationUnitGroupSets: {
                    ...state.selectedOptionsForOrganisationUnitGroupSets,
                    [payload.id]: payload.value,
                },
            }

        default:
            return state
    }
}

export default dataSetReport
export { defaultState }
