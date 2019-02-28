import debounce from 'lodash.debounce'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import {
    getApi,
    getResources,
    deleteResource as sendDeleteResourceRequest,
} from '../../utils/api'
import { RESOURCE_ENDPOINT } from '../../utils/api/constants'
import i18n from '../../utils/i18n/locales'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import { showSuccessSnackBar, showErrorSnackBar } from './feedback'
import {
    goToNextPage as goToNextPageOrig,
    goToPrevPage as goToPrevPageOrig,
    resetPagination,
    setPagination,
} from './pagination'

export const actionTypes = {
    LOADING_RESOURCES_START: 'LOADING_RESOURCES_START',
    LOADING_RESOURCES_SUCCESS: 'LOADING_RESOURCES_SUCCESS',
    LOADING_RESOURCES_ERROR: 'LOADING_RESOURCES_ERROR',
    SET_RESEARCH_SEARCH: 'SET_RESEARCH_SEARCH',
    VIEW_RESOURCE: 'VIEW_RESOURCE',
    SHOW_SHARING_SETTINGS: 'SHOW_SHARING_SETTINGS',
    EDIT_RESOURCE: 'EDIT_RESOURCE',
    ADD_RESOURCE: 'ADD_RESOURCE',
    DELETE_RESOURCE_START: 'DELETE_RESOURCE_START',
    DELETE_RESOURCE_SUCCESS: 'DELETE_RESOURCE_SUCCESS',
    DELETE_RESOURCE_ERROR: 'DELETE_RESOURCE_ERROR',
    RESET_CONTEXT_MENU: 'RESET_CONTEXT_MENU',
}

/**
 * @returns {Object}
 */
export const loadingResourcesStart = () => ({
    type: actionTypes.LOADING_RESOURCES_START,
})

/**
 * @param {Array} resources
 * @returns {Object}
 */
export const loadingResourcesSuccess = resources => ({
    type: actionTypes.LOADING_RESOURCES_SUCCESS,
    payload: resources,
})

/**
 * @returns {Object}
 */
export const loadingResourcesError = () => ({
    type: actionTypes.LOADING_RESOURCES_ERROR,
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

    return getResources(page, pageSize, search)
        .then(response => {
            dispatch(loadingResourcesSuccess(response.documents))
            dispatch(setPagination(response.pager))
        })
        .catch(error => {
            dispatch(loadingResourcesErrorWithFeedback(error))
        })
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

/**
 * @param {Object} resource
 * @param {string} resource.id
 * @returns {Object}
 */
export const viewResource = resource => {
    const { id } = resource
    const baseUrl = getApi().baseUrl
    const resourceUrl = `${baseUrl}/${RESOURCE_ENDPOINT}/${id}/data`
    window.open(resourceUrl)

    return {
        type: actionTypes.VIEW_RESOURCE,
        payload: resource,
    }
}

/**
 * @param {Object} resource
 * @returns {Object}
 */
export const showSharingSettings = resource => ({
    type: actionTypes.SHOW_SHARING_SETTINGS,
    payload: resource,
})

/**
 * @param {Object} resource
 * @returns {Object}
 */
export const editResource = resource => ({
    type: actionTypes.EDIT_RESOURCE,
    payload: resource,
})

/**
 * @returns {Object}
 */
export const addResource = resource => ({
    type: actionTypes.ADD_RESOURCE,
    payload: resource,
})

export const deleteResourceStart = () => ({
    type: actionTypes.DELETE_RESOURCE_START,
})

export const deleteResourceSuccess = () => ({
    type: actionTypes.DELETE_RESOURCE_SUCCESS,
})

export const deleteResourceError = () => ({
    type: actionTypes.DELETE_RESOURCE_ERROR,
})

const successMessage = i18n.t('The resource has been deleted successfully')
export const deleteResourceSuccessWithFeedback = () => dispatch => {
    dispatch(showSuccessSnackBar(successMessage))
    dispatch(deleteResourceSuccess())
}

const defaultDeleteResourceErrorMessage = i18n.t(
    'An error occurred when deleting the resource!'
)
export const deleteResourceErrorWithFeedback = error => dispatch => {
    const message = humanReadableErrorMessage(
        error,
        defaultDeleteResourceErrorMessage
    )
    dispatch(showErrorSnackBar(message))
    dispatch(deleteResourceError())
}

export const deleteResource = resource => dispatch => {
    dispatch(deleteResourceStart())

    return sendDeleteResourceRequest(resource.id)
        .then(() => {
            dispatch(deleteResourceSuccessWithFeedback())
            dispatch(loadResources())
        })
        .catch(error => dispatch(deleteResourceErrorWithFeedback(error)))
}

export const resetContextMenu = () => ({
    type: actionTypes.RESET_CONTEXT_MENU,
})

export const closeContextMenu = refreshList => dispatch => {
    dispatch(resetContextMenu())

    if (refreshList) {
        dispatch(resetPagination())
        dispatch(loadResources())
    }
}
