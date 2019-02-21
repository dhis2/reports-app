import { getPeriodTypes } from '../../utils/api'

export const ACTION_TYPES = {
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
    type: ACTION_TYPES.REPORT_PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

/**
 * @returns {Object}
 */
export const loadPeriodTypesError = () => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPES_ERRORED,
})

export const loadPeriodTypes = () => dispatch =>
    getPeriodTypes()
        .then(periodTypes => dispatch(loadPeriodTypesSuccess(periodTypes)))
        .catch(error => {
            console.error(error)
            dispatch(loadPeriodTypesError())
        })

export const selectPeriodType = event => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPE_SELECTED,
    payload: event.target.value,
})

export const selectPeriod = period => ({
    type: ACTION_TYPES.REPORT_PERIOD_SELECTED,
    payload: period,
})
