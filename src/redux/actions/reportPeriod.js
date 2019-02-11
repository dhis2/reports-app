import { getPeriodTypes } from '../../utils/api'
import i18n from '@dhis2/d2-i18n'

export const ACTION_TYPES = {
    REPORT_PERIOD_TYPES_RECEIVED: 'REPORT_PERIOD_TYPES_RECEIVED',
    REPORT_PERIOD_TYPES_ERRORED: 'REPORT_PERIOD_TYPES_ERRORED',
    REPORT_PERIOD_TYPE_SELECTED: 'REPORT_PERIOD_TYPE_SELECTED',
    REPORT_PERIOD_SELECTED: 'REPORT_PERIOD_SELECTED',
}

export const errorMessage = i18n.t('Could not load period types')

export const loadPeriodTypesSuccess = periodTypes => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

export const loadPeriodTypesError = () => ({
    type: ACTION_TYPES.REPORT_PERIOD_TYPES_ERRORED,
    payload: errorMessage,
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
