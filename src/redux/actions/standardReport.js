import debounce from 'lodash.debounce'
import omit from 'lodash.omit'
import {
    getFilteredStandardReports,
    deleteStandardReport as deleteStandardReportRequest,
    getStandardReportDetails,
    postStandardReport,
    updateStandardReport,
} from '../../utils/api'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import i18n from '@dhis2/d2-i18n'
import {
    goToNextPage as goToNextPageOrig,
    goToPrevPage as goToPrevPageOrig,
} from './pagination'
import { setPagination } from './pagination'
import { showSuccessSnackBar, showErrorSnackBar } from './feedback'
import { loadStandardReportTables } from './standardReportTables'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { reportTypes } from '../../pages/standard-report/standard.report.conf'
import { fileToText } from '../../utils/fileToText'

export const actionTypes = {
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
}

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
export const requestDeleteStandardReport = report => ({
    type: actionTypes.REQUEST_DELETE_STANDARD_REPORT,
    payload: report,
})

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
    dispatch({ type: actionTypes.HTML_REPORT_SHOW, payload: reportData })
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
