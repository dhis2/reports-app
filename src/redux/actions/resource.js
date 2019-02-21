import debounce from 'lodash.debounce'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import { getResource } from '../../utils/api'
import i18n from '../../utils/i18n/locales'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { showErrorSnackBar } from './feedback'
import {
    goToNextPage as goToNextPageOrig,
    goToPrevPage as goToPrevPageOrig,
} from './pagination'

export const actionTypes = {
    LOADING_RESOURCES_START: 'LOADING_RESOURCES_START',
    LOADING_RESOURCES_SUCCESS: 'LOADING_RESOURCES_SUCCESS',
    LOADING_RESOURCES_ERROR: 'LOADING_RESOURCES_ERROR',
    SET_RESEARCH_SEARCH: 'SET_RESEARCH_SEARCH',
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
    const { pagination, resource } = getState()
    const { page, pageSize } = pagination
    const { search } = resource

    return getResource(page, pageSize, search)
        .then(resources => {
            // @TODO: Check for response property
            loadingResourcesSuccess(resources.documents)
            setPagination(response.pager)
        })
        .catch(error => loadingResourcesErrorWithFeedback(error))
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToNextPage = () => dispatch => {
    dispatch(goToNextPageOrig())
    dispatch(loadResources())
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToPrevPage = () => dispatch => {
    dispatch(goToPrevPageOrig())
    dispatch(loadResources())
}

/**
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
const debouncedLoadResources = debounce(
    dispatch => dispatch(loadResources()),
    DEBOUNCE_DELAY
)
export const setSearch = searchTerm => dispatch => {
    dispatch({ type: actionTypes.SET_RESEARCH_SEARCH, payload: searchTerm })
    debouncedLoadResources(dispatch)
}
