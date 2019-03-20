import debounce from 'lodash.debounce'
import i18n from '@dhis2/d2-i18n'
import omit from 'lodash.omit'
import size from 'lodash.size'

import { DEBOUNCE_DELAY } from '../../config/search.config'
import {
    getApi,
    deleteStandardReport as deleteStandardReportRequest,
    getFilteredStandardReports,
    getStandardReportDetails,
    getStandardReportHtmlReport,
    getStandardReportTable,
    postStandardReport,
    updateStandardReport,
} from '../../utils/api'
import {
    clearFeedback,
    showSuccessSnackBar,
    showErrorSnackBar,
    showConfirmationSnackBar,
} from './feedback'
import { extractRequiredReportParams } from '../../utils/standardReport/extractRequiredReportParams'
import { fileToText } from '../../utils/fileToText'
import {
    goToNextPage as goToNextPageOrig,
    goToPrevPage as goToPrevPageOrig,
    setPagination,
} from './pagination'
import { loadStandardReportTables } from './standardReportTables'
import {
    loadingReportDataStart,
    loadingReportDataSuccess,
    loadingReportDataError,
} from './reportData'
import { reportTypes } from '../../pages/standard-report/standard.report.conf'
import { validateRequiredParams } from '../../utils/standardReport/validateRequiredParams'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'

export const actionTypes = {
    SET_SELECTED_REPORT: 'SET_SELECTED_REPORT',
    LOAD_STANDARD_REPORTS: 'LOAD_STANDARD_REPORTS',
    LOADING_STANDARD_REPORTS_START: 'LOADING_STANDARD_REPORTS_START',
    LOADING_STANDARD_REPORTS_SUCCESS: 'LOADING_STANDARD_REPORTS_SUCCESS',
    LOADING_STANDARD_REPORTS_ERROR: 'LOADING_STANDARD_REPORTS_ERROR',
    LOADING_STANDARD_REPORTS_DETAILS_START:
        'LOADING_STANDARD_REPORTS_DETAILS_START',
    LOADING_STANDARD_REPORTS_DETAILS_SUCCESS:
        'LOADING_STANDARD_REPORTS_DETAILS_SUCCESS',
    LOADING_STANDARD_REPORTS_DETAILS_ERROR:
        'LOADING_STANDARD_REPORTS_DETAILS_ERROR',
    SET_SEARCH: 'SET_SEARCH',
    ADD_REPORT_FORM_SHOW: 'ADD_REPORT_FORM_SHOW',
    ADD_REPORT_FORM_HIDE: 'ADD_REPORT_FORM_HIDE',
    EDIT_REPORT_FORM_SHOW: 'EDIT_REPORT_FORM_SHOW',
    EDIT_REPORT_FORM_HIDE: 'EDIT_REPORT_FORM_HIDE',
    CREATE_REPORT_SHOW: 'CREATE_REPORT_SHOW',
    CREATE_REPORT_HIDE: 'CREATE_REPORT_HIDE',
    SHARING_SETTINGS_SHOW: 'SHARING_SETTINGS_SHOW',
    SHARING_SETTINGS_HIDE: 'SHARING_SETTINGS_HIDE',
    REQUEST_DELETE_STANDARD_REPORT: 'REQUEST_DELETE_STANDARD_REPORT',
    DELETE_STANDARD_REPORT_START: 'DELETE_STANDARD_REPORT_START',
    DELETE_STANDARD_REPORT_SUCCESS: 'DELETE_STANDARD_REPORT_SUCCESS',
    DELETE_STANDARD_REPORT_ERROR: 'DELETE_STANDARD_REPORT_ERROR',
    HTML_REPORT_SHOW: 'HTML_REPORT_SHOW',
    HTML_REPORT_HIDE: 'HTML_REPORT_HIDE',
    CLOSE_CONTEXT_MENU: 'CLOSE_CONTEXT_MENU',
    STANDARD_REPORT_SEND_START: 'STANDARD_REPORT_SEND_START',
    STANDARD_REPORT_SEND_SUCCESS: 'STANDARD_REPORT_SEND_SUCCESS',
    STANDARD_REPORT_SEND_ERROR: 'STANDARD_REPORT_SEND_ERROR',
    DEFINE_REQUIRED_PARAMS: 'DEFINE_REQUIRED_PARAMS',
    REQUIRED_PARAMS_ERROR: 'REQUIRED_PARAMS_ERROR',
    GENERATE_PDF_REPORT: 'GENERATE_PDF_REPORT',
    CANCEL_GENERATING_PDF_REPORT: 'CANCEL_GENERATING_PDF_REPORT',
}

/**
 * @returns {Object}
 */
export const setSelectedReport = report => ({
    type: actionTypes.SET_SELECTED_REPORT,
    payload: report,
})

/**
 * @returns {Object}
 */
export const startLoadingStandardReports = () => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_START,
})

/**
 * @param {Array} reports
 * @returns {Object}
 */
export const loadingStandardReportsSuccess = reports => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_SUCCESS,
    payload: reports,
})

/**
 * @returns {Object}
 */
export const loadingStandardReportsError = () => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingStandardReportsErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the standard reports'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingStandardReportsError())
}

/**
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
const debouncedLoadStandardReports = debounce(
    dispatch => dispatch(loadStandardReports()),
    DEBOUNCE_DELAY
)
export const setSearch = searchTerm => dispatch => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: searchTerm })
    debouncedLoadStandardReports(dispatch)
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToNextPage = () => dispatch => {
    dispatch(goToNextPageOrig())
    dispatch(loadStandardReports())
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToPrevPage = () => dispatch => {
    dispatch(goToPrevPageOrig())
    dispatch(loadStandardReports())
}

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const addReportFormShow = report => ({
    type: actionTypes.ADD_REPORT_FORM_SHOW,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const addReportFormHide = report => ({
    type: actionTypes.ADD_REPORT_FORM_HIDE,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const editReportFormShow = report => dispatch => {
    dispatch({
        type: actionTypes.EDIT_REPORT_FORM_SHOW,
        payload: report,
    })
    dispatch(loadStandardReportDetails(report.id))
}

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const editReportFormHide = report => ({
    type: actionTypes.EDIT_REPORT_FORM_HIDE,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const createReportShow = report => ({
    type: actionTypes.CREATE_REPORT_SHOW,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const createReportHide = report => ({
    type: actionTypes.CREATE_REPORT_HIDE,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const sharingSettingsShow = report => ({
    type: actionTypes.SHARING_SETTINGS_SHOW,
    payload: report,
})

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const sharingSettingsHide = report => ({
    type: actionTypes.SHARIING_SETTINGS_HIDE,
    payload: report,
})

/**
 * Used to get a confirmation from the user
 * @return {Object}
 */
export const requestDeleteStandardReport = report => dispatch => {
    dispatch({
        type: actionTypes.REQUEST_DELETE_STANDARD_REPORT,
        payload: report,
    })
    dispatch(
        showConfirmationSnackBar('Do you really want to delete this report?')
    )
}

/**
 * @return {Object}
 */
export const deleteStandardReportStart = () => ({
    type: actionTypes.DELETE_STANDARD_REPORT_START,
})

/**
 * @return {Object}
 */
export const deleteStandardReportSuccess = () => ({
    type: actionTypes.DELETE_STANDARD_REPORT_SUCCESS,
})

/**
 * @returns {Object}
 */
export const deleteStandardReportError = () => ({
    type: actionTypes.DELETE_STANDARD_REPORT_ERROR,
})

/**
 * @return {Object}
 */
export const deleteStandardReportSuccessWithFeedback = () => dispatch => {
    dispatch(deleteStandardReportSuccess())
    dispatch(loadStandardReports())
    dispatch(clearFeedback())
}

/**
 * @param {Error} error
 * @return {Object}
 */
export const deleteStandardReportErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while trying to delete the standard report'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(deleteStandardReportError())
}

/**
 * @returns {Object}
 */
export const closeContextMenu = refreshList => dispatch => {
    dispatch({ type: actionTypes.CLOSE_CONTEXT_MENU })

    if (refreshList) {
        dispatch(loadStandardReports())
    }
}

/**
 * @param {string} reportData
 * @returns {Object}
 */
export const showReportData = reportData => dispatch => {
    dispatch(loadingReportDataSuccess(reportData))
    dispatch(closeContextMenu())
}

/**
 * @returns {Object}
 */
export const hideReportData = () => ({
    type: actionTypes.HTML_REPORT_HIDE,
})

/**
 * @return {Function} Redux thunk
 */
export const loadStandardReports = (postLoadStandartReportTables = false) => (
    dispatch,
    getState
) => {
    const { standardReport, pagination } = getState()
    const { page, pageSize } = pagination
    const { search } = standardReport

    dispatch(startLoadingStandardReports())
    return getFilteredStandardReports(page, pageSize, search)
        .then(response => {
            dispatch(loadingStandardReportsSuccess(response.reports))
            dispatch(setPagination(response.pager))

            if (postLoadStandartReportTables) {
                dispatch(loadStandardReportTables())
            }
        })
        .catch(error =>
            dispatch(loadingStandardReportsErrorWithFeedback(error))
        )
}

/**
 * @param {Object} report
 * @return {Function} A redux thunk
 */
export const deleteStandardReport = () => (dispatch, getState) => {
    const { selectedReport } = getState().standardReport

    dispatch(deleteStandardReportStart())
    return deleteStandardReportRequest(selectedReport.id)
        .then(() => dispatch(deleteStandardReportSuccessWithFeedback()))
        .catch(error => dispatch(deleteStandardReportErrorWithFeedback(error)))
}

/**
 * @returns {Object}
 */
export const loadingStandardReportsDetailsStart = () => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_DETAILS_START,
})

/**
 * @param {Array} reports
 * @returns {Object}
 */
export const loadingStandardReportsDetailsSuccess = reports => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_DETAILS_SUCCESS,
    payload: reports,
})

/**
 * @returns {Object}
 */
export const loadingStandardReportsDetailsError = () => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_DETAILS_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingStandardReportsDetailsErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the standard report details'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingStandardReportsDetailsError())
}

/**
 * @param {string} id
 * @returns {Function}
 */
export const loadStandardReportDetails = id => dispatch => {
    dispatch(loadingStandardReportsDetailsStart())

    getStandardReportDetails(id)
        .then(report => dispatch(loadingStandardReportsDetailsSuccess(report)))
        .catch(error => dispatch(loadingStandardReportsDetailsError(error)))
}

/**
 * @returns {Object}
 */
export const loadingSendStandardReportStart = () => ({
    type: actionTypes.STANDARD_REPORT_SEND_START,
})

/**
 * @returns {Object}
 */
export const loadingSendStandardReportSuccess = () => ({
    type: actionTypes.STANDARD_REPORT_SEND_SUCCESS,
})

/**
 * @returns {Object}
 */
export const loadingSendStandardReportError = () => ({
    type: actionTypes.STANDARD_REPORT_SEND_ERROR,
})

/**
 * @param {Object} report
 * @param {bool} isEdit - When false, add new report
 * @returns {Promise}
 */
export const sendStandardReport = (report, isEdit) => dispatch => {
    dispatch(loadingSendStandardReportStart())

    const formattedReport = {
        ...report,
        relativePeriods: (report.relativePeriods || []).reduce(
            (acc, cur) => ({ ...acc, [cur]: true }),
            {}
        ),
        reportParams: (report.reportParams || []).reduce(
            (acc, cur) => ({ ...acc, [cur]: true }),
            {}
        ),
        reportTable: report.reportTable ? { id: report.reportTable } : '',
    }
    const cleanedReport =
        report.type !== reportTypes.JASPER_REPORT_TABLE
            ? omit(formattedReport, ['reportTable'])
            : formattedReport
    const doRequest = isEdit
        ? report => updateStandardReport(report)
        : report => postStandardReport(report)
    const successMessage = isEdit
        ? i18n.t('The report has been updated successfully')
        : i18n.t('The report has been added successfully')
    const errorMessage = isEdit
        ? i18n.t('An error occurred while updating the report!')
        : i18n.t('An error occurred while adding the report!')

    const request = !cleanedReport.designContent
        ? doRequest(cleanedReport)
        : fileToText(cleanedReport.designContent.file)
              .then(file => ({ ...cleanedReport, designContent: file }))
              .then(doRequest)

    return request
        .then(() => {
            dispatch(showSuccessSnackBar(successMessage))
            dispatch(loadingSendStandardReportSuccess())
            dispatch(loadStandardReports())
        })
        .catch(error => {
            const displayMessage = humanReadableErrorMessage(
                error,
                errorMessage
            )
            dispatch(showErrorSnackBar(displayMessage))
            dispatch(loadingSendStandardReportError())
        })
}

/**
 * =============================================
 * Generate report
 * =============================================
 */

/**
 * @param {Error} error
 * @returns {Function}
 */
export const generatingHtmlReportErrorWithFeedback = error => dispatch => {
    const generatingHtmlReportErrorDefaultMessage = i18n.t(
        'An error occurred while generating the html report'
    )
    const displayMessage = humanReadableErrorMessage(
        error,
        generatingHtmlReportErrorDefaultMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingReportDataError())
}

/**
 * @param {string} id
 * @returns {Function}
 */
export const generateHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())
    const { standardReport, organisationUnits, reportPeriod } = getState()
    const { reportParams } = standardReport
    const { id } = standardReport.selectedReport

    const reportRequestBody = {}
    if (reportParams.organisationUnit) {
        reportRequestBody.ou = organisationUnits.selected.id
    }

    if (reportParams.reportPeriod) {
        reportRequestBody.pe = reportPeriod.selectedPeriod
    }

    return getStandardReportHtmlReport(id, reportRequestBody)
        .then(report => dispatch(loadingReportDataSuccess(report)))
        .catch(error => dispatch(generatingHtmlReportErrorWithFeedback(error)))
}

export const defineRequiredReportParams = requiredParams => ({
    type: actionTypes.DEFINE_REQUIRED_PARAMS,
    payload: requiredParams,
})

export const requiredReportParamsError = errors => ({
    type: actionTypes.REQUIRED_PARAMS_ERROR,
    payload: errors,
})

export const cancelGeneratingPdfReport = () => ({
    type: actionTypes.CANCEL_GENERATING_PDF_REPORT,
})

export const submitRequiredReportParams = () => (dispatch, getState) => {
    const state = getState()
    const { standardReport } = state
    const { selectedReport, reportParams } = standardReport
    const errors = validateRequiredParams(state, reportParams)

    if (size(errors)) {
        dispatch(requiredReportParamsError(errors))
    } else {
        if (selectedReport.type === reportTypes.HTML) {
            dispatch(generateHtmlReport())
        } else {
            dispatch(generatePdfReport())
        }
    }
}

export const getStandardReportTableRequiredParams = report =>
    report.reportTable
        ? getStandardReportTable(report.reportTable.id)
        : Promise.resolve({ reportParams: {} })

/**
 * @param {string} reportId
 * @returns {Function}
 */
export const showReportParams = report => dispatch => {
    dispatch(setSelectedReport(report))
    return getStandardReportTableRequiredParams(report)
        .then(({ reportParams }) => {
            const requiredParams = extractRequiredReportParams(reportParams)

            if (!size(requiredParams)) {
                if (report.type === reportTypes.HTML) {
                    dispatch(generateHtmlReport())
                } else {
                    dispatch(generatePdfReport())
                }
            } else {
                dispatch(defineRequiredReportParams(requiredParams))
            }
        })
        .catch(error => {
            throw error
        })
}

export const generatePdfReport = () => (dispatch, getState) => {
    let reportQueryString = `t=${new Date().getTime()}`
    const api = getApi()
    const { standardReport, organisationUnits, reportPeriod } = getState()
    const { reportParams } = standardReport
    const { id } = standardReport.selectedReport
    const reportPath = `reports/${id}/data.pdf`

    if (reportParams.organisationUnit) {
        reportQueryString += `&ou=${organisationUnits.selected.id}`
    }

    if (reportParams.reportPeriod) {
        reportQueryString += `&p=${reportPeriod.selectedPeriod}`
    }

    window.open(`${api.baseUrl}/${reportPath}?${reportQueryString}`)
    dispatch({ type: actionTypes.GENERATE_PDF_REPORT })
}
