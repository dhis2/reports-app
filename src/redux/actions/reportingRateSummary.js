import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
} from './htmlReport'
import { getReportingRateSummaryReport } from '../../utils/api'

export const actionTypes = {
    SET_SHOW_FORM: 'SET_SHOW_FORM',
}

/**
 * @param {boolean} toggle
 * @returns {Object} The set show form action
 */
export const showForm = toggle => ({
    type: actionTypes.SET_SHOW_FORM,
    payload: toggle,
})

/**
 * @returns {Function} redux thunk
 */
export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStart())

    const { organisationUnits, dataSet, reportPeriod } = getState()

    getReportingRateSummaryReport(
        organisationUnits.selected.id,
        dataSet.selected.id,
        reportPeriod.selectedPeriod,
        organisationUnits.selectedOptions
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(({ message }) => dispatch(loadingHtmlReportError(message)))
}
