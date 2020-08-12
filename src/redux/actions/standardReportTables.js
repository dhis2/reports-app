import i18n from '@dhis2/d2-i18n'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { getStandardReportTables } from '../../utils/api'
import { showErrorSnackBar } from './feedback'

export const actionTypes = {
    STANDARD_REPORT_TABLES_LOADING_START:
        'STANDARD_REPORT_TABLES_LOADING_START',
    STANDARD_REPORT_TABLES_LOADING_SUCCESS:
        'STANDARD_REPORT_TABLES_LOADING_SUCCESS',
    STANDARD_REPORT_TABLES_LOADING_ERROR:
        'STANDARD_REPORT_TABLES_LOADING_ERROR',
}

/**
 * @returns {Object}
 */
export const loadingStandardReportTablesStart = () => ({
    type: actionTypes.STANDARD_REPORT_TABLES_LOADING_START,
})

/**
 * @param {Array} tables
 * @returns {Object}
 */
export const loadingStandardReportTablesSuccess = tables => ({
    type: actionTypes.STANDARD_REPORT_TABLES_LOADING_SUCCESS,
    payload: tables,
})

/**
 * @returns {Object}
 */
export const loadingStandardReportTablesError = () => ({
    type: actionTypes.STANDARD_REPORT_TABLES_LOADING_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingStandardReportTablesErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the report table options'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)

    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingStandardReportTablesError())
}

/**
 * @returns {Function}
 */
export const loadStandardReportTables = () => dispatch => {
    dispatch(loadingStandardReportTablesStart())

    return getStandardReportTables()
        .then(reportTables => {
            const formattedReportTables = reportTables.map(({ id, name }) => ({
                value: id,
                label: name,
            }))
            dispatch(loadingStandardReportTablesSuccess(formattedReportTables))
        })
        .catch(error => {
            dispatch(loadingStandardReportTablesErrorWithFeedback(error))
        })
}
