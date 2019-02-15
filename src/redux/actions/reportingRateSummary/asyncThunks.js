import { getReportingRateSummaryReport } from '../../../utils/api'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
} from '../htmlReport'

/**
 * @returns {Function} redux thunk
 */
export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStart())

    const {
        organisationUnits,
        dataSet,
        reportPeriod,
        reportingRateSummary,
    } = getState()

    return getReportingRateSummaryReport(
        organisationUnits.selected.id,
        dataSet.selected.id,
        reportPeriod.selectedPeriod,
        reportingRateSummary.criteria,
        organisationUnits.selectedOptions
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(error => dispatch(loadingHtmlReportError(error)))
}
