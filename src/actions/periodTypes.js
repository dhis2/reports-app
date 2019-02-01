import { getPeriodTypes } from '../api';

export const ACTION_TYPES = {
    PERIOD_TYPES_RECEIVED: 'PERIOD_TYPES_RECEIVED',
    PERIOD_TYPES_ERRORED: 'PERIOD_TYPES_ERRORED',
};

export const loadPeriodTypesSuccess = periodTypes => ({
    type: ACTION_TYPES.PERIOD_TYPES_RECEIVED,
    payload: periodTypes,
});

export const loadPeriodTypesError = error => ({
    type: ACTION_TYPES.PERIOD_TYPES_RECEIVED,
    payload: error,
});

const loadPeriodTypes = () => async (dispatch) => {
    try {
        const { periodTypes } = await getPeriodTypes();
        dispatch(loadPeriodTypesSuccess(periodTypes));
    } catch (error) {
        dispatch(loadPeriodTypesError(new Error('Could not load period types')));
    }
};
export default loadPeriodTypes;

