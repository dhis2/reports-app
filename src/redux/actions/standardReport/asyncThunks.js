import {
    getFilteredStandardReports,
    deleteStandardReport as deleteStandardReportRequest,
} from '../../../utils/api'
import {
    startLoadingStandardReports,
    loadingStandardReportsSuccess,
    loadingStandardReportsError,
    deleteStandardReportStart,
    deleteStandardReportSuccess,
    deleteStandardReportError,
} from '../standardReport'
import { setPagination } from '../pagination'

/**
 * @return {Function} Redux thunk
 */
export const loadStandardReports = () => (dispatch, getState) => {
    const { standardReport, pagination } = getState()
    const { page, pageSize } = pagination
    const { search } = standardReport

    dispatch(startLoadingStandardReports())
    return getFilteredStandardReports(page, pageSize, search)
        .then(response => {
            dispatch(loadingStandardReportsSuccess(response.reports))
            dispatch(setPagination(response.pager))
        })
        .catch(error => dispatch(loadingStandardReportsError(error)))
}

/**
 * @param {Object} report
 * @return {Function} A redux thunk
 */
export const deleteStandardReport = () => (dispatch, getState) => {
    const { selectedReport } = getState().standardReport

    dispatch(deleteStandardReportStart())
    return deleteStandardReportRequest(selectedReport.id)
        .then(() => dispatch(deleteStandardReportSuccess()))
        .catch(error => dispatch(deleteStandardReportError(error)))
}
