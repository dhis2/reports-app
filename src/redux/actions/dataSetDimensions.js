import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import i18n from '../../utils/i18n/locales'
import { loadDimensions } from './dataSetDimensions/asyncThunks'
import { showWarningSnackBar } from './feedback'

export const actionTypes = {
    LOADING_DIMENSIONS_START: 'LOADING_DIMENSIONS_START',
    LOADING_DIMENSIONS_SUCCESS: 'LOADING_DIMENSIONS_SUCCESS',
    LOADING_DIMENSIONS_ERROR: 'LOADING_DIMENSIONS_ERROR',
    SELECT_DIMENSION_OPTION: 'SELECT_DIMENSION_OPTION',
}

export const loadingDimensionsStart = () => ({
    type: actionTypes.LOADING_DIMENSIONS_START,
})

export const loadingDimensionsSuccess = dimensions => ({
    type: actionTypes.LOADING_DIMENSIONS_SUCCESS,
    payload: dimensions,
})

/**
 * @param (Error) error
 * @returns {Function}
 */
export const loadingDimensionsError = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the data set dimensions'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showWarningSnackBar(displayMessage))
    dispatch({
        type: actionTypes.LOADING_DIMENSIONS_ERROR,
        payload: displayMessage,
    })
}

export const selectDimensionOption = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION_OPTION,
    payload: { dimension, value },
})

export { loadDimensions }
