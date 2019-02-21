import { getReportingRateSummaryReport } from '../../utils/api'
import {
    loadingHtmlReportStartWithFeedback,
    loadingHtmlReportSuccessWithFeedback,
    loadingHtmlReportErrorWithFeedback,
} from './htmlReport'

/**
 * @returns {Function} redux thunk
 */
export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStartWithFeedback())

    const { organisationUnits, dataSet, reportPeriod } = getState()

    return getReportingRateSummaryReport(
        organisationUnits.selected,
        dataSet.selected.id,
        reportPeriod.selectedPeriod,
        organisationUnits.selectedOptions
    )
        .then(response =>
            dispatch(loadingHtmlReportSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingHtmlReportErrorWithFeedback(error)))
}
