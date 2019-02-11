import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
} from './htmlReport'

export const actionTypes = {
    SET_SHOW_FORM: 'SET_SHOW_FORM',
    SET_SELECTED_CRITERIA: 'SET_SELECTED_CRITERIA',
}

/**
 * @param {boolean} toggle
 * @returns {Object} The set show form action
 */
export const setShowForm = toggle => ({
    type: actionTypes.SET_SHOW_FORM,
    payload: toggle,
})

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
const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStart())

    const {
        organisationUnits,
        dataSet,
        reportPeriod,
        reportingRateSummary,
    } = getState()

    getReportingRateSummaryReport(
        organisationUnits.selected.id,
        dataSet.selected.id,
        reportPeriod.selectedPeriod,
        reportingRateSummary.criteria,
        organisationUnits.selectedOptions
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(({ message }) => dispatch(loadingHtmlReportError(message)))
}
