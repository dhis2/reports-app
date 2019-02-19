import XLSX from 'xlsx'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { showLoader, showSuccessSnackBar, showErrorSnackBar } from './feedback'
import i18n from '../../utils/i18n/locales'

export const actionTypes = {
    LOADING_HTML_REPORT_START: 'LOADING_HTML_REPORT_START',
    LOADING_HTML_REPORT_SUCCESS: 'LOADING_HTML_REPORT_SUCCESS',
    LOADING_HTML_REPORT_ERROR: 'LOADING_HTML_REPORT_ERROR',
    SET_DATA_SET_REPORT_COMMENT: 'SET_DATA_SET_REPORT_COMMENT',
    DOWNLOAD_DATA_SET_REPORT_XLS: 'DOWNLOAD_DATA_SET_REPORT_XLS',
    SHARING_DATA_SET_REPORT_COMMENT_SUCCESS:
        'SHARING_DATA_SET_REPORT_COMMENT_SUCCESS',
    SHARING_DATA_SET_REPORT_COMMENT_START:
        'SHARING_DATA_SET_REPORT_COMMENT_START',
    SHARING_DATA_SET_REPORT_COMMENT_ERROR:
        'SHARING_DATA_SET_REPORT_COMMENT_ERROR',
    UNSET_HTML_REPORT: 'UNSET_HTML_REPORT',
}

/**
 * @returns {Object}
 */
export const loadingHtmlReportStart = () => ({
    type: actionTypes.LOADING_HTML_REPORT_START,
})

/**
 * @param {string} htmlReport
 * @returns {Object}
 */
export const loadingHtmlReportSuccess = htmlReport => ({
    type: actionTypes.LOADING_HTML_REPORT_SUCCESS,
    payload: htmlReport,
})

/**
 * @returns {Object}
 */
export const loadingHtmlReportError = () => ({
    type: actionTypes.LOADING_HTML_REPORT_ERROR,
})

/**
 * @returns {Function}
 */
export const loadingHtmlReportStartWithFeedback = () => dispatch => {
    dispatch(showLoader())
    dispatch(loadingHtmlReportStart())
}

/**
 * @param {string} htmlReport
 * @return {Object}
 */
export const loadingHtmlReportSuccessWithFeedback = htmlReport => dispatch => {
    dispatch(showSuccessSnackBar(i18n.t('Successfully loaded the report')))
    dispatch(loadingHtmlReportSuccess(htmlReport))
}

/**
 * @param {Error} error
 */
export const loadingHtmlReportErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t('An error occurred while loading the report!')
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingHtmlReportError())
}

export const unsetHtmlReport = () => ({
    type: actionTypes.UNSET_HTML_REPORT,
})

/**
 * @param {DOMElement[]} tableNodes
 * @return {Object}
 */
export const exportReportToXls = tableNodes => {
    const workbook = XLSX.utils.book_new()

    tableNodes.forEach((tableNode, index) => {
        const worksheet = XLSX.utils.table_to_sheet(tableNode)
        XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${index}`)
    })

    XLSX.writeFile(workbook, 'report.xlsx')

    return { type: actionTypes.DOWNLOAD_DATA_SET_REPORT_XLS }
}

/**
 * @param {string} comment
 * @returns {Object}
 */
export const setReportComment = comment => ({
    type: actionTypes.SET_DATA_SET_REPORT_COMMENT,
    payload: comment,
})

/**
 * @returns {Object}
 */
export const sharingReportCommentStart = () => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_START,
})

/**
 * @returns {Object}
 */
export const sharingReportCommentSuccess = () => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_SUCCESS,
})

/**
 * @returns {Object}
 */
export const sharingReportCommentError = () => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_ERROR,
})

/**
 * @returns {Function}
 */
export const sharingReportCommentStartWithFeedback = () => dispatch => {
    dispatch(showLoader())
    dispatch(sharingReportCommentStart())
}

/**
 * @returns {Function}
 */
export const sharingReportCommentSuccessWithFeedback = () => dispatch => {
    dispatch(showSuccessSnackBar(i18n.t('Successfully added comment')))
    dispatch(sharingReportCommentSuccess())
}

/**
 * @param {Error} error
 * @returns {Function}
 */
export const sharingReportCommentErrorWithFeedback = error => dispatch => {
    const defaultMessge = i18n.t(
        'An error occurred while submitting your comment!'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessge)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(sharingReportCommentError())
}
