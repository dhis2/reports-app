import { getReportingRateSummaryReport } from '../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccessWithFeedback,
    loadingReportDataErrorWithFeedback,
} from './reportData'

/**
 * @returns {Function} redux thunk
 */
export const loadReportData = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())

    const { organisationUnits, dataSet, reportPeriod } = getState()

    return getReportingRateSummaryReport(
        organisationUnits.selected,
        dataSet.selected.id,
        reportPeriod.selectedPeriod,
        organisationUnits.selectedOptions
    )
        .then(response =>
            dispatch(loadingReportDataSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingReportDataErrorWithFeedback(error)))
}
