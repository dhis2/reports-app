import { actionTypes } from '../actions/dataSetReport'
import { actionTypes as reportHtmlActionTypes } from '../actions/htmlReport'
import { ERROR, LOADING, SUCCESS } from '../../utils/feedbackTypes'
import i18n from '../../utils/i18n/locales'

const defaultState = {
    loading: false,
    showForm: true,
    selectedUnitOnly: false,
    selectedDimensionOptions: {},
    showFeedback: false,
    feedbackConf: {},
}

const dataSetReport = (state = defaultState, action = {}) => {
    const { type, payload } = action
    switch (type) {
        case actionTypes.SHOW_DATA_SET_REPORT_FORM:
            return { ...state, showForm: true }

        case reportHtmlActionTypes.LOADING_HTML_REPORT_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: {
                    type: LOADING,
                },
            }

        case reportHtmlActionTypes.LOADING_HTML_REPORT_SUCCESS:
            return {
                ...state,
                showForm: false,
                loadHtmlReport: false,
                showFeedback: true,
                feedbackConf: {
                    type: SUCCESS,
                    message: i18n.t('Report generated'),
                },
            }

        case reportHtmlActionTypes.LOADING_HTML_REPORT_ERROR:
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

        case actionTypes.SET_SELECTED_UNIT_ONLY:
            return {
                ...state,
                selectedUnitOnly: payload,
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

        default:
            return state
    }
}

export default dataSetReport
export { defaultState }
