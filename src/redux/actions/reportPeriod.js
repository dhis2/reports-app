import i18n from '@dhis2/d2-i18n'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { showErrorSnackBar } from './feedback'
import { getPeriodTypes } from '../../utils/api'

export const actionTypes = {
    REPORT_PERIOD_TYPES_LOADING_START: 'REPORT_PERIOD_TYPES_LOADING_START',
    REPORT_PERIOD_TYPES_RECEIVED: 'REPORT_PERIOD_TYPES_RECEIVED',
    REPORT_PERIOD_TYPES_ERRORED: 'REPORT_PERIOD_TYPES_ERRORED',
    REPORT_PERIOD_TYPE_SELECTED: 'REPORT_PERIOD_TYPE_SELECTED',
    REPORT_PERIOD_SELECTED: 'REPORT_PERIOD_SELECTED',
}

/**
 * @param {Array} periodTypes
 * @returns {Object}
 */
export const loadPeriodTypesSuccess = periodTypes => ({
    type: actionTypes.REPORT_PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

/**
 * @returns {Object}
 */
export const loadPeriodTypesError = () => ({
    type: actionTypes.REPORT_PERIOD_TYPES_ERRORED,
})

/**
 * @param {Error} error
 * @return {Function}
 */

export const fallbackErrorMessage = i18n.t('Could not load period types')
export const loadPeriodTypesErrorWithFeedback = error => dispatch => {
    // eslint-disable-next-line
    const displayMessage = humanReadableErrorMessage(
        error,
        fallbackErrorMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadPeriodTypesError())
}

export const loadPeriodTypes = () => dispatch =>
    getPeriodTypes()
        .then(periodTypes => dispatch(loadPeriodTypesSuccess(periodTypes)))
        .catch(error => {
            console.error(error)
            dispatch(loadPeriodTypesErrorWithFeedback(error))
        })

export const selectPeriodType = event => ({
    type: actionTypes.REPORT_PERIOD_TYPE_SELECTED,
    payload: event.target.value,
})

export const selectPeriod = period => ({
    type: actionTypes.REPORT_PERIOD_SELECTED,
    payload: period,
})
