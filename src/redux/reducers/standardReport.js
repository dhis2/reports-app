import { CONTEXT_MENU_ACTION } from '../../pages/standard-report/standard.report.conf.js'
import { actionTypes as reportDataActionTypes } from '../actions/reportData.js'
import { actionTypes } from '../actions/standardReport.js'

export const defaultState = {
    reports: [],
    selectedReport: {},
    selectedAction: '',
    search: '',
    open: false,
    reportData: '',
    loading: false,
    loadingError: '',
    requestDelete: false,
    loadingDetails: false,
    loadingSendReport: false,

    reportParams: {},
    reportParamsErrors: [],
    showReportParams: false,
}

export const standardReport = (state = defaultState, action = {}) => {
    const { type, payload } = action

    switch (type) {
        case actionTypes.SET_SELECTED_REPORT:
            return {
                ...state,
                selectedReport: payload,
            }

        case actionTypes.CLEAR_SELECTED_REPORT:
            return {
                ...state,
                selectedReport: {},
            }

        case actionTypes.LOADING_STANDARD_REPORTS_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.LOADING_STANDARD_REPORTS_SUCCESS:
            return {
                ...state,
                reports: payload,
                loading: false,
            }

        case actionTypes.LOADING_STANDARD_REPORTS_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.SET_SEARCH:
            return {
                ...state,
                search: payload,
            }

        case actionTypes.SHARING_SETTINGS_SHOW:
            return {
                ...state,
                open: true,
                selectedReport: payload,
                selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
            }

        case actionTypes.CLOSE_CONTEXT_MENU:
            return {
                ...state,
                open: false,
                selectedReport: {},
                selectedAction: '',
            }

        case actionTypes.REQUEST_DELETE_STANDARD_REPORT:
            return {
                ...state,
                requestDelete: true,
                selectedReport: payload,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            }

        case actionTypes.DELETE_STANDARD_REPORT_START:
            return {
                ...state,
                requestDelete: false,
                loading: true,
            }

        case actionTypes.DELETE_STANDARD_REPORT_SUCCESS:
            return {
                ...state,
                selectedReport: {},
                selectedAction: '',
                loading: false,
            }

        case actionTypes.DELETE_STANDARD_REPORT_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.LOADING_STANDARD_REPORTS_DETAILS_START:
            return {
                ...state,
                loadingDetails: true,
            }

        case actionTypes.LOADING_STANDARD_REPORTS_DETAILS_SUCCESS:
            return {
                ...state,
                open: true,
                loadingDetails: false,
                selectedReport: payload,
            }

        case actionTypes.LOADING_STANDARD_REPORTS_DETAILS_ERROR:
            return {
                ...state,
                loadingDetails: false,
            }

        case actionTypes.STANDARD_REPORT_SEND_START:
            return {
                ...state,
                loadingSendReport: true,
            }

        case actionTypes.STANDARD_REPORT_SEND_SUCCESS:
        case actionTypes.STANDARD_REPORT_SEND_ERROR:
            return {
                ...state,
                open: false,
                loadingSendReport: false,
            }

        case actionTypes.DEFINE_REQUIRED_PARAMS:
            return {
                ...state,
                reportParams: payload,
                showReportParams: true,
            }

        case actionTypes.REQUIRED_PARAMS_ERROR:
            return {
                ...state,
                reportParamsErrors: payload,
            }

        case actionTypes.GENERATE_PDF_REPORT:
        case actionTypes.CANCEL_GENERATING_PDF_REPORT:
        case reportDataActionTypes.LOADING_REPORT_DATA_SUCCESS:
            return {
                ...state,
                reportParams: {},
                reportParamsErrors: [],
                showReportParams: false,
            }

        default:
            return state
    }
}
