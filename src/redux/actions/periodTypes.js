import { getPeriodTypes } from '../../utils/api'
import i18n from '@dhis2/d2-i18n'

export const ACTION_TYPES = {
    PERIOD_TYPES_RECEIVED: 'PERIOD_TYPES_RECEIVED',
    PERIOD_TYPES_ERRORED: 'PERIOD_TYPES_ERRORED',
}

export const loadPeriodTypesSuccess = periodTypes => ({
    type: ACTION_TYPES.PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

export const loadPeriodTypesError = () => ({
    type: ACTION_TYPES.PERIOD_TYPES_ERRORED,
    payload: i18n.t('Could not load period types'),
})

const loadPeriodTypes = () => dispatch => {
    getPeriodTypes()
        .then(periodTypes => dispatch(loadPeriodTypesSuccess(periodTypes)))
        .catch(() => dispatch(loadPeriodTypesError()))
}
export default loadPeriodTypes
