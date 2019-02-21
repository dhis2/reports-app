import debounce from 'lodash.debounce'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import { getResource } from '../../utils/api'
import i18n from '../../utils/i18n/locales'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { showErrorSnackBar } from './feedback'

export const actionTypes = {
    LOADING_RESOURCES_START: 'LOADING_RESOURCES_START',
    LOADING_RESOURCES_SUCCESS: 'LOADING_RESOURCES_SUCCESS',
    LOADING_RESOURCES_ERROR: 'LOADING_RESOURCES_ERROR',
}

/**
 * @returns {Object}
 */
export const loadingResourcesStart = () => ({
    type: LOADING_RESOURCES_START,
})

/**
 * @param {Array} resources
 * @returns {Object}
 */
export const loadingResourcesSuccess = resources => ({
    type: LOADING_RESOURCES_SUCCESS,
    payload: resources,
})

/**
 * @returns {Object}
 */
export const loadingResourcesError = () => ({
    type: LOADING_RESOURCES_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingResourcesErrorWithFeedback = error => dispatch => {
    const defaultMessage = i18n.t(
        'An error occurred while loading the resources!'
    )
    const displayMessage = humanReadableErrorMessage(error, defaultMessage)
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingResourcesError())
}

/**
 * @returns {Function}
 */
export const loadResources = () => (dispatch, getState) => {
    dispatch(loadingResourcesStart())

    return getResource()
        .then(resources => loadingResourcesSuccess(resources))
        .catch(error => loadingResourcesErrorWithFeedback(error))
}
