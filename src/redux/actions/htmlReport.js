export const actionTypes = {
    LOADING_HTML_REPORT_START: 'LOADING_HTML_REPORT_START',
    LOADING_HTML_REPORT_SUCCESS: 'LOADING_HTML_REPORT_SUCCESS',
    LOADING_HTML_REPORT_ERROR: 'LOADING_HTML_REPORT_ERROR',
}

/**
 * @returns {Object}
 */
export const loadingHtmlReportStart = () => ({
    type: actionTypes.LOADING_HTML_REPORT_START,
})

/**
 * @param {string} htmlReport
 * @return {Object}
 */
export const loadingHtmlReportSuccess = htmlReport => ({
    type: actionTypes.LOADING_HTML_REPORT_SUCCESS,
    payload: htmlReport,
})

/**
 * @param {string} errorMessage
 */
export const loadingHtmlReportError = errorMessage => ({
    type: actionTypes.LOADING_HTML_REPORT_ERROR,
    payload: errorMessage,
})
