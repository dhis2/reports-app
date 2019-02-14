import i18n from '@dhis2/d2-i18n'
import { getPeriodTypes } from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'

export const ACTION_TYPES = {
    REPORT_PERIOD_TYPES_LOADING_START: 'REPORT_PERIOD_TYPES_LOADING_START',
    REPORT_PERIOD_TYPES_RECEIVED: 'REPORT_PERIOD_TYPES_RECEIVED',
    REPORT_PERIOD_TYPES_ERRORED: 'REPORT_PERIOD_TYPES_ERRORED',
    REPORT_PERIOD_TYPE_SELECTED: 'REPORT_PERIOD_TYPE_SELECTED',
    REPORT_PERIOD_SELECTED: 'REPORT_PERIOD_SELECTED',
}


export const loadPeriodTypesSuccess = periodTypes => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

/**
 * @param {Error} error
 * @return {Function}
 */
export const fallbackErrorMessage = i18n.t('Could not load period types')
export const loadPeriodTypesError = error => (dispatch) => {
    const displayMessage = humanReadableErrorMessage(error, fallbackErrorMessage)
    dispatch({
        type: ACTION_TYPES.REPORT_PERIOD_TYPES_ERRORED,
        payload: displayMessage,
    })
}

export const loadPeriodTypes = () => dispatch =>
    getPeriodTypes()
        .then(periodTypes => dispatch(loadPeriodTypesSuccess(periodTypes)))
        .catch(error => {
            console.error(error)
            dispatch(loadPeriodTypesError(error))
        })

export const selectPeriodType = event => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPE_SELECTED,
    payload: event.target.value,
})

export const selectPeriod = period => ({
    type: ACTION_TYPES.REPORT_PERIOD_SELECTED,
    payload: period,
})
