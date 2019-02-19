import { getReportingRateSummaryReport } from '../../utils/api'
import {
    loadingHtmlReportStartWithFeedback,
    loadingHtmlReportSuccessWithFeedback,
    loadingHtmlReportErrorWithFeedback,
} from './htmlReport'

export const actionTypes = {
    SET_SELECTED_CRITERIA: 'SET_SELECTED_CRITERIA',
}

/**
 * @param {string} selectedCriteria
 * @returns {Object} The select criteria action
 */
export const selectCriteria = selectedCriteria => ({
    type: actionTypes.SET_SELECTED_CRITERIA,
    payload: selectedCriteria,
})

/**
 * @returns {Function} redux thunk
 */
export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStartWithFeedback())

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
        .then(response =>
            dispatch(loadingHtmlReportSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingHtmlReportErrorWithFeedback(error)))
}
