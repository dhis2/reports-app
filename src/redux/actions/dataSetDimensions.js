import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import i18n from '@dhis2/d2-i18n'
import { showWarningSnackBar } from './feedback'
import { getDimensions } from '../../utils/api'

export const actionTypes = {
    LOADING_DIMENSIONS_START: 'LOADING_DIMENSIONS_START',
    LOADING_DIMENSIONS_SUCCESS: 'LOADING_DIMENSIONS_SUCCESS',
    LOADING_DIMENSIONS_ERROR: 'LOADING_DIMENSIONS_ERROR',
    SELECT_DIMENSION_OPTION: 'SELECT_DIMENSION_OPTION',
}

/**
 * @returns {Object}
 */
export const loadingDimensionsStart = () => ({
    type: actionTypes.LOADING_DIMENSIONS_START,
})

/**
 * @param {Array} dimensions
 * @returns {Object}
 */
export const loadingDimensionsSuccess = dimensions => ({
    type: actionTypes.LOADING_DIMENSIONS_SUCCESS,
    payload: dimensions,
})

export const loadingDimensionsError = () => ({
    type: actionTypes.LOADING_DIMENSIONS_ERROR,
})

/**
 * @param (Error) error
 * @returns {Function}
 */
export const loadingDimensionsErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the data set dimensions'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showWarningSnackBar(displayMessage))
    dispatch(loadingDimensionsError())
}

/**
 * @param {string} dimension
 * @param {string} value
 * @returns {Object}
 */
export const selectDimensionOption = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION_OPTION,
    payload: { dimension, value },
})

/**
 * @returns {Function}
 */
export const loadDimensions = () => (dispatch, getState) => {
    dispatch(loadingDimensionsStart())

    const { dataSet } = getState()
    return getDimensions(dataSet.selected.id)
        .then(dimensions => dispatch(loadingDimensionsSuccess(dimensions)))
        .catch(error => dispatch(loadingDimensionsErrorWithFeedback(error)))
}
