import { getDimensions, getD2 } from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import i18n from '../../utils/i18n/locales'
import {
    showErrorSnackBar,
    showWarningSnackBar,
} from './feedback';

export const actionTypes = {
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    LOADING_DATA_SET_OPTIONS_START: 'LOADING_DATA_SET_OPTIONS_START',
    LOADING_DATA_SET_OPTIONS_SUCCESS: 'LOADING_DATA_SET_OPTIONS_SUCCESS',
    LOADING_DATA_SET_OPTIONS_ERROR: 'LOADING_DATA_SET_OPTIONS_ERROR',
    LOADING_DIMENSIONS_START: 'LOADING_DIMENSIONS_START',
    LOADING_DIMENSIONS_SUCCESS: 'LOADING_DIMENSIONS_SUCCESS',
    LOADING_DIMENSIONS_ERROR: 'LOADING_DIMENSIONS_ERROR',
    SELECT_DIMENSION_OPTION: 'SELECT_DIMENSION_OPTION',
}

export const selectDataSet = dataSetId => ({
    type: actionTypes.SELECT_DATA_SET,
    payload: dataSetId,
})

export const loadingDataSetOptionsStart = () => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_START,
})

export const loadingDataSetOptionsSuccess = options => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS,
    payload: options,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingDataSetOptionsError = error => (dispatch) => {
    const defaultMessage = i18n.t('An error occurred whole loading the data set options')
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch({
        type: actionTypes.LOADING_DATA_SET_OPTIONS_ERROR,
        payload: displayMessage,
    })
}

export const loadDataSetOptions = (filter = null) => dispatch => {
    const d2 = getD2()
    const paging = false
    const fields = 'id,displayName'

    dispatch(loadingDataSetOptionsStart())
    d2.models.dataSet
        .list({ paging, fields })
        .then(response => response.toArray())
        .then(options => (filter ? options.filter(filter) : options))
        .then(options => dispatch(loadingDataSetOptionsSuccess(options)))
        .catch(error => dispatch(loadingDataSetOptionsError(error)))
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
export const loadingDimensionsError = error => (dispatch) => {
    const defaultMessage = i18n.t('An error occurred while loading the data set dimensions')
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showWarningSnackBar(displayMessage))
    dispatch({
        type: actionTypes.LOADING_DIMENSIONS_ERROR,
        payload: displayMessage,
    })
}

export const loadDimensions = () => (dispatch, getState) => {
    dispatch(loadingDimensionsStart())

    const { dataSet } = getState()
    getDimensions(dataSet.selected.id)
        .then(response =>
            response.error
                ? Promise.reject(response.error)
                : Promise.resolve(response.dimensions)
        )
        .then(dimensions => dispatch(loadingDimensionsSuccess(dimensions)))
        .catch(error => dispatch(loadingDimensionsError(error)))
}

export const selectDimensionOption = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION_OPTION,
    payload: { dimension, value },
})
