import { getD2 } from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import i18n from '@dhis2/d2-i18n'
import { getDataSetOptions } from '../../utils/api'
import { showErrorSnackBar } from './feedback'

export const actionTypes = {
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    LOADING_DATA_SET_OPTIONS_START: 'LOADING_DATA_SET_OPTIONS_START',
    LOADING_DATA_SET_OPTIONS_SUCCESS: 'LOADING_DATA_SET_OPTIONS_SUCCESS',
    LOADING_DATA_SET_OPTIONS_ERROR: 'LOADING_DATA_SET_OPTIONS_ERROR',
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

export const loadingDataSetOptionsError = () => ({
    type: actionTypes.LOADING_DATA_SET_OPTIONS_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingDataSetOptionsErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred whole loading the data set options'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingDataSetOptionsError())
}

export const loadDataSetOptions = (filter = null) => dispatch => {
    dispatch(loadingDataSetOptionsStart())
    return getDataSetOptions()
        .then(options => (filter ? options.filter(filter) : options))
        .then(options => dispatch(loadingDataSetOptionsSuccess(options)))
        .catch(error => dispatch(loadingDataSetOptionsErrorWithFeedback(error)))
}
