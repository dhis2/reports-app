import XLSX from 'xlsx'

export const actionTypes = {
    LOADING_HTML_REPORT_START: 'LOADING_HTML_REPORT_START',
    LOADING_HTML_REPORT_SUCCESS: 'LOADING_HTML_REPORT_SUCCESS',
    LOADING_HTML_REPORT_ERROR: 'LOADING_HTML_REPORT_ERROR',
    DOWNLOAD_DATA_SET_REPORT_XLS: 'DOWNLOAD_DATA_SET_REPORT_XLS',
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
