import i18n from '../../utils/i18n/locales'
import debounce from 'lodash.debounce'
import {
    getFilteredStandardReports,
    deleteStandardReport as deleteStandardReportRequest,
} from '../../utils/api'
import {
    goToNextPage as goToNextPageOrig,
    goToPrevPage as goToPrevPageOrig,
    setPagination,
} from './pagination'

export const actionTypes = {
    LOAD_STANDARD_REPORTS: 'LOAD_STANDARD_REPORTS',
    LOADING_STANDARD_REPORTS_START: 'LOADING_STANDARD_REPORTS_START',
    LOADING_STANDARD_REPORTS_SUCCESS: 'LOADING_STANDARD_REPORTS_SUCCESS',
    LOADING_STANDARD_REPORTS_ERROR: 'LOADING_STANDARD_REPORTS_ERROR',
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
 * @param {string} error
 * @returns {Object}
 */
export const loadingStandardReportsError = error => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_ERROR,
    payload: error,
})

/**
 * @return {Function} Redux thunk
 */
const DEFAULT_SUCCESS_MESSAGE = i18n.t('Successfully loaded the reports')
export const loadStandardReports = (
    successMessage = DEFAULT_SUCCESS_MESSAGE
) => (dispatch, getState) => {
    const { standardReport, pagination } = getState()
    const { page, pageSize } = pagination
    const { search } = standardReport

    dispatch(startLoadingStandardReports())
    getFilteredStandardReports(page, pageSize, search)
        .then(response => {
            dispatch(
                loadingStandardReportsSuccess({
                    reports: response.reports,
                    successMessage: i18n.t(successMessage),
                })
            )
            dispatch(setPagination(response.pager))
        })
        .catch(({ message }) => dispatch(loadingStandardReportsError(message)))
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
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
export const DEBOUNCE_DELAY = 500
export const setSearch = searchTerm => dispatch => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: searchTerm })
    debounce(() => dispatch(loadStandardReports()), DEBOUNCE_DELAY)
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
export const editReportFormShow = report => ({
    type: actionTypes.EDIT_REPORT_FORM_SHOW,
    payload: report,
})

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
export const deleteStandardReportSuccess = () => dispatch => {
    dispatch({ type: actionTypes.DELETE_STANDARD_REPORT_SUCCESS })
    dispatch(loadStandardReports('Successfully deleted the report'))
}

/**
 * @return {Object}
 */
export const deleteStandardReportError = error => ({
    type: actionTypes.DELETE_STANDARD_REPORT_ERROR,
    payload: error,
})

/**
 * @param {Object} report
 * @return {Function} A redux thunk
 */
export const deleteStandardReport = () => (dispatch, getState) => {
    const { selectedReport } = getState().standardReport

    dispatch(deleteStandardReportStart())
    deleteStandardReportRequest(selectedReport.id)
        .then(() => dispatch(deleteStandardReportSuccess()))
        .catch(({ message }) => dispatch(deleteStandardReportError(message)))
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
 * @param {string} htmlReport
 * @returns {Object}
 */
export const showHtmlReport = htmlReport => dispatch => {
    dispatch({ type: actionTypes.HTML_REPORT_SHOW, payload: htmlReport })
    dispatch(closeContextMenu())
}

/**
 * @returns {Object}
 */
export const hideHtmlReport = () => ({
    type: actionTypes.HTML_REPORT_HIDE,
})
