import debounce from 'lodash.debounce'
import i18n from '@dhis2/d2-i18n'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { getStandardReportTables } from '../../utils/api'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import { showErrorSnackBar } from './feedback'

export const MIN_CHAR_LENGTH = 3

export const actionTypes = {
    STANDARD_REPORT_TABLES_SET_SEARCH_TERM:
        'STANDARD_REPORT_TABLES_SET_SEARCH_TERM',
    STANDARD_REPORT_TABLES_CLEAR_SEARCH_TERM:
        'STANDARD_REPORT_TABLES_CLEAR_SEARCH_TERM',
    STANDARD_REPORT_TABLES_LOADING_START:
        'STANDARD_REPORT_TABLES_LOADING_START',
    STANDARD_REPORT_TABLES_LOADING_SUCCESS:
        'STANDARD_REPORT_TABLES_LOADING_SUCCESS',
    STANDARD_REPORT_TABLES_LOADING_ERROR:
        'STANDARD_REPORT_TABLES_LOADING_ERROR',
}

/**
 * @returns {Function}
 */
export const loadFilteredStandardReportTables = searchTerm => dispatch => {
    dispatch(setSearch(searchTerm))
    if (searchTerm.length >= MIN_CHAR_LENGTH) {
        debouncedSearchStandardReportTables(dispatch)
    }
}

/**
 * @returns {Object}
 */
export const loadingStandardReportTablesStart = () => ({
    type: actionTypes.STANDARD_REPORT_TABLES_LOADING_START,
})

/**
 * @returns {Object}
 */
export const setSearch = searchTerm => ({
    type: actionTypes.STANDARD_REPORT_TABLES_SET_SEARCH_TERM,
    payload: searchTerm,
})

export const clearSearch = () => ({
    type: actionTypes.STANDARD_REPORT_TABLES_CLEAR_SEARCH_TERM,
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
export const searchStandardReportTables = () => (dispatch, getState) => {
    const { standardReportTables } = getState()

    dispatch(loadingStandardReportTablesStart())

    return getStandardReportTables(standardReportTables.searchTerm)
        .then(reportTables => {
            const formattedReportTables = reportTables.map(
                ({ id, displayName }) => ({
                    value: id,
                    label: displayName,
                })
            )
            dispatch(loadingStandardReportTablesSuccess(formattedReportTables))
        })
        .catch(error => {
            dispatch(loadingStandardReportTablesErrorWithFeedback(error))
        })
}

const debouncedSearchStandardReportTables = debounce(
    dispatch => dispatch(searchStandardReportTables()),
    DEBOUNCE_DELAY
)
