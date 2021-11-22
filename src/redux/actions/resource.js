import i18n from '@dhis2/d2-i18n'
import { push } from 'connected-react-router'
import debounce from 'lodash.debounce'
import { DEBOUNCE_DELAY } from '../../config/search.config'
import {
    RESOURCE_ENDPOINT,
    getApi,
    getResources,
    getResourceById,
    postResource,
    putResource,
    deleteResource as sendDeleteResourceRequest,
} from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'
import {
    showSuccessSnackBar,
    showErrorSnackBar,
    showConfirmationSnackBar,
} from './feedback'
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
    SET_RESOURCE_SEARCH: 'SET_RESOURCE_SEARCH',
    VIEW_RESOURCE: 'VIEW_RESOURCE',
    SHOW_SHARING_SETTINGS: 'SHOW_SHARING_SETTINGS',
    SET_RESOURCE: 'SET_RESOURCE',
    REQUEST_DELETE_RESOURCE: 'REQUEST_DELETE_RESOURCE',
    DELETE_RESOURCE_START: 'DELETE_RESOURCE_START',
    DELETE_RESOURCE_SUCCESS: 'DELETE_RESOURCE_SUCCESS',
    DELETE_RESOURCE_ERROR: 'DELETE_RESOURCE_ERROR',
    CLEAR_SELECTED_RESOURCE: 'CLEAR_SELECTED_RESOURCE',
    RESOURCE_ADD_LOADING_START: 'RESOURCE_ADD_LOADING_START',
    RESOURCE_ADD_LOADING_SUCCESS: 'RESOURCE_ADD_LOADING_SUCCESS',
    RESOURCE_ADD_LOADING_ERROR: 'RESOURCE_ADD_LOADING_ERROR',
    RESOURCE_EDIT_LOADING_START: 'RESOURCE_EDIT_LOADING_START',
    RESOURCE_EDIT_LOADING_SUCCESS: 'RESOURCE_EDIT_LOADING_SUCCESS',
    RESOURCE_EDIT_LOADING_ERROR: 'RESOURCE_EDIT_LOADING_ERROR',
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
export const loadingResourcesSuccess = (resources) => ({
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
export const loadingResourcesErrorWithFeedback = (error) => (dispatch) => {
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
        .then((response) => {
            dispatch(loadingResourcesSuccess(response.documents))
            dispatch(setPagination(response.pager))
        })
        .catch((error) => {
            dispatch(loadingResourcesErrorWithFeedback(error))
        })
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToNextPage = () => (dispatch) => {
    dispatch(goToNextPageOrig())
    dispatch(loadResources())
}

/**
 * @param {number} nextPage
 * @return {Function}
 */
export const goToPrevPage = () => (dispatch) => {
    dispatch(goToPrevPageOrig())
    dispatch(loadResources())
}

/**
 * @param {string} searchTerm
 * @returns {Object}
 */
export const setSearch = (searchTerm) => ({
    type: actionTypes.SET_RESOURCE_SEARCH,
    payload: searchTerm,
})

/**
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
const debouncedLoadResources = debounce(
    (dispatch) => dispatch(loadResources()),
    DEBOUNCE_DELAY
)
export const setSearchAndLoadResources = (searchTerm) => (dispatch) => {
    dispatch(setSearch(searchTerm))
    debouncedLoadResources(dispatch)
}

/**
 * @param {Object} resource
 * @param {string} resource.id
 * @returns {Object}
 */
export const viewResource = (resource) => {
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
export const showSharingSettings = (resource) => ({
    type: actionTypes.SHOW_SHARING_SETTINGS,
    payload: resource,
})

/**
 * @returns {Object}
 */
export const addResource = () => (dispatch) => {
    dispatch(toResourceForm())
}

/**
 * @param {Object} resource
 * @returns {Object}
 */
export const editResource = (resource) => (dispatch) => {
    dispatch(setResource(resource))
    dispatch(toResourceForm(resource.id))
}

/**
 * @param {String} id
 * @returns {Object}
 */
export const toResourceForm = (id) => {
    const path = id ? `/resource/edit/${id}` : '/resource/new'
    return push(path)
}

/**
 * @param {String} id
 * @returns {Object}
 */
export const loadResource = (id) => async (dispatch) => {
    const resource = await getResourceById(id)
    return dispatch(setResource(resource))
}

/**
 * @param {Object} resource
 * @returns {Object}
 */
export const setResource = (resource) => ({
    type: actionTypes.SET_RESOURCE,
    payload: resource,
})

/**
 * Used to get a confirmation from the user
 * @return {Object}
 */
const confirmationMessage = i18n.t(
    'Do you really want to delete this resource?'
)
export const requestDeleteResource = (resource) => (dispatch) => {
    dispatch({
        type: actionTypes.REQUEST_DELETE_RESOURCE,
        payload: resource,
    })
    dispatch(showConfirmationSnackBar(confirmationMessage))
}

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
export const deleteResourceSuccessWithFeedback = () => (dispatch) => {
    dispatch(showSuccessSnackBar(successMessage))
    dispatch(deleteResourceSuccess())
}

const defaultDeleteResourceErrorMessage = i18n.t(
    'An error occurred when deleting the resource!'
)
export const deleteResourceErrorWithFeedback = (error) => (dispatch) => {
    const message = humanReadableErrorMessage(
        error,
        defaultDeleteResourceErrorMessage
    )
    dispatch(showErrorSnackBar(message))
    dispatch(deleteResourceError())
}

export const deleteResource = () => (dispatch, getState) => {
    dispatch(deleteResourceStart())
    const {
        resource: { selectedResource },
    } = getState()
    return sendDeleteResourceRequest(selectedResource.id)
        .then(() => {
            dispatch(deleteResourceSuccessWithFeedback())
            dispatch(loadResources())
        })
        .catch((error) => dispatch(deleteResourceErrorWithFeedback(error)))
}

export const clearSelectedResource = () => ({
    type: actionTypes.CLEAR_SELECTED_RESOURCE,
})

export const backToList = () => (dispatch) => {
    dispatch(clearSelectedResource())
    dispatch(push('/resource'))
}

export const closeContextMenu = (refreshList) => (dispatch) => {
    dispatch(clearSelectedResource())

    if (refreshList) {
        dispatch(resetPagination())
        dispatch(loadResources())
    }
}

/**
 *
 * Adding a resource
 *
 */

/**
 * @returns {Object}
 */
export const loadingAddResourceStart = () => ({
    type: actionTypes.RESOURCE_ADD_LOADING_START,
})

/**
 * @returns {Object}
 */
export const loadingAddResourceSuccess = () => ({
    type: actionTypes.RESOURCE_ADD_LOADING_SUCCESS,
})

/**
 * @returns {Object}
 */
export const loadingAddResourceError = () => ({
    type: actionTypes.RESOURCE_ADD_LOADING_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingAddResourceErrorWithFeedback = (error) => (dispatch) => {
    const defaultAddResourceErrorMessage = i18n.t(
        'An error occurred while adding the resource!'
    )
    const displayMessage = humanReadableErrorMessage(
        error,
        defaultAddResourceErrorMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingAddResourceError())
}

/**
 * @param {Object} resource
 * @param {File} [file]
 * @returns {Function}
 */
export const addNewResource = (resource, file) => (dispatch) => {
    dispatch(loadingAddResourceStart())

    postResource(resource, file)
        .then(() => {
            dispatch(loadingAddResourceSuccess())
            dispatch(loadResources())
        })
        .catch((error) => {
            dispatch(loadingAddResourceErrorWithFeedback(error))
        })
}

/**
 *
 * Editing a resource
 *
 */

/**
 * @returns {Object}
 */
export const loadingEditResourceStart = () => ({
    type: actionTypes.RESOURCE_EDIT_LOADING_START,
})

/**
 * @returns {Object}
 */
export const loadingEditResourceSuccess = () => ({
    type: actionTypes.RESOURCE_EDIT_LOADING_SUCCESS,
})

/**
 * @returns {Object}
 */
export const loadingEditResourceError = () => ({
    type: actionTypes.RESOURCE_EDIT_LOADING_ERROR,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadingEditResourceErrorWithFeedback = (error) => (dispatch) => {
    const defaultAddResourceErrorMessage = i18n.t(
        'An error occurred while saving the modifications!'
    )
    const displayMessage = humanReadableErrorMessage(
        error,
        defaultAddResourceErrorMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadingAddResourceError())
}

/**
 * @param {Object} resource
 * @param {File} [file]
 * @returns {Function}
 */
export const updateResource = (resource, file) => (dispatch, getState) => {
    dispatch(loadingEditResourceStart())

    const resourceId = getState().resource.selectedResource.id
    putResource(resourceId, resource, file)
        .then(() => {
            dispatch(loadingEditResourceSuccess())
            dispatch(loadResources())
        })
        .catch((error) => {
            dispatch(loadingEditResourceErrorWithFeedback(error))
        })
}
