import { loadHtmlReport } from './reportingRateSummary/asyncThunks'

export const actionTypes = {
    SET_SHOW_FORM: 'SET_SHOW_FORM',
    SET_SELECTED_CRITERIA: 'SET_SELECTED_CRITERIA',
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
 * @param {string} selectedCriteria
 * @returns {Object} The select criteria action
 */
export const selectCriteria = selectedCriteria => ({
    type: actionTypes.SET_SELECTED_CRITERIA,
    payload: selectedCriteria,
})

export { loadHtmlReport }
