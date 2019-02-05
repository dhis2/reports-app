import { getPeriodTypes } from '../../utils/api'

export const ACTION_TYPES = {
    PERIOD_TYPES_RECEIVED: 'PERIOD_TYPES_RECEIVED',
    PERIOD_TYPES_ERRORED: 'PERIOD_TYPES_ERRORED',
}

export const loadPeriodTypesSuccess = periodTypes => ({
    type: ACTION_TYPES.PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
})

export const loadPeriodTypesError = error => ({
    type: ACTION_TYPES.PERIOD_TYPES_ERRORED,
    payload: error,
})

const loadPeriodTypes = () => dispatch => {
    getPeriodTypes()
        .then(periodTypes => dispatch(loadPeriodTypesSuccess(periodTypes)))
        .catch(() =>
            dispatch(
                loadPeriodTypesError(new Error('Could not load period types'))
            )
        )
}
export default loadPeriodTypes
