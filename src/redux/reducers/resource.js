import { actionTypes } from '../actions/resource'
import { resourceActions } from '../../utils/resource/constants'

export const defaultSelectedResource = { id: '', displayName: '' }
export const defaultState = {
    open: false,
    loading: false,
    addEditLoading: false,
    search: '',
    collection: [],
    selectedAction: '',
    selectedResource: defaultSelectedResource,
}

export const resource = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case actionTypes.REQUEST_DELETE_RESOURCE:
            return {
                ...state,
                selectedResource: payload,
            }
        case actionTypes.LOADING_RESOURCES_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.LOADING_RESOURCES_SUCCESS:
            return {
                ...state,
                loading: false,
                collection: payload,
            }

        case actionTypes.LOADING_RESOURCES_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.SET_RESOURCE_SEARCH:
            return {
                ...state,
                search: payload,
            }

        case actionTypes.SET_RESOURCE:
            return {
                ...state,
                open: true,
                selectedResource: payload,
            }

        case actionTypes.SHOW_SHARING_SETTINGS:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: resourceActions.SHARING_SETTINGS,
            }

        case actionTypes.DELETE_RESOURCE_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.DELETE_RESOURCE_SUCCESS:
        case actionTypes.DELETE_RESOURCE_ERROR:
            return {
                ...state,
                loading: false,
            }

        case actionTypes.CLEAR_SELECTED_RESOURCE:
            return {
                ...state,
                open: false,
                selectedAction: '',
                selectedResource: defaultSelectedResource,
            }

        case actionTypes.RESOURCE_ADD_LOADING_START:
        case actionTypes.RESOURCE_EDIT_LOADING_START:
            return {
                ...state,
                addEditLoading: true,
            }

        case actionTypes.RESOURCE_ADD_LOADING_SUCCESS:
        case actionTypes.RESOURCE_EDIT_LOADING_SUCCESS:
            return {
                ...state,
                addEditLoading: false,
                open: false,
                selectedAction: '',
                selectedResource: defaultSelectedResource,
            }

        case actionTypes.RESOURCE_ADD_LOADING_ERROR:
        case actionTypes.RESOURCE_EDIT_LOADING_ERROR:
            return {
                ...state,
                addEditLoading: false,
            }

        default:
            return state
    }
}
