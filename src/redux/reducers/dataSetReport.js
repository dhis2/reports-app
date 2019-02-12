import { actionTypes } from '../actions/dataSetReport'
import { ERROR, LOADING, SUCCESS } from '../../utils/feedbackTypes.js'
import i18n from '../../utils/i18n/locales'

const defaultState = {
    loading: false,
    showForm: true,
    showOptions: false,
    selectedUnitOnly: false,
    reportHtml: '',
    reportComment: '',
    dataSetDimensions: [],
    selectedDataSet: { id: '', displayName: '' },
    selectedDimensionOptions: {},
    selectedOrgUnitGroupOptions: {},
    showFeedback: false,
    feedbackConf: {},
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

        case actionTypes.LOADING_DIMENSIONS_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: { type: LOADING },
            }

        case actionTypes.LOADING_DIMENSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                dataSetDimensions: payload,
                showFeedback: false,
                feedbackConf: {
                    type: SUCCESS,
                    message: i18n.t(
                        'Successfully loaded the data set dimensions'
                    ),
                },
            }

        case actionTypes.LOADING_DIMENSIONS_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
                dataSetDimensions: [],
                showFeedback: false,
                feedbackConf: {
                    type: SUCCESS,
                    message: i18n.t(payload),
                },
            }

        case actionTypes.TOGGLE_SHOW_OPTIONS:
            return {
                ...state,
                showOptions: !state.showOptions,
            }

        case actionTypes.SELECT_DATA_SET:
            return {
                ...state,
                selectedDataSet: payload,
                selectedDimensionOptions: {},
            }

        case actionTypes.SELECT_DIMENSION_OPTION:
            return {
                ...state,
                selectedDimensionOptions: {
                    ...state.selectedDimensionOptions,
                    [payload.dimension]: payload.value,
                },
            }

        case actionTypes.SET_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
            }

        case actionTypes.SELECT_ORG_UNIT_OPTION:
            return {
                ...state,
                selectedOrgUnitGroupOptions: {
                    ...state.selectedOrgUnitGroupOptions,
                    [payload.id]: payload.value,
                },
            }

        case actionTypes.SHARING_DATA_SET_REPORT_COMMENT_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: {
                    type: LOADING,
                },
            }

        case actionTypes.SHARING_DATA_SET_REPORT_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                showFeedback: true,
                feedbackConf: {
                    type: SUCCESS,
                    message: i18n.t('Comment added'),
                },
            }

        case actionTypes.SHARING_DATA_SET_REPORT_COMMENT_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
                showFeedback: true,
                feedbackConf: {
                    type: ERROR,
                    message: i18n.t("Comment couldn't be added"),
                },
            }

        case actionTypes.SET_DATA_SET_REPORT_COMMENT:
            return {
                ...state,
                reportComment: payload,
            }

        default:
            return state
    }
}

export default dataSetReport
export { defaultState }
