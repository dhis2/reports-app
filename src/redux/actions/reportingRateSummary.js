import { loadHtmlReport } from './reportingRateSummary/asyncThunks'

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

export { loadHtmlReport }
