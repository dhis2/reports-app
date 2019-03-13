import { actionTypes } from '../actions/resource'
import { resourceActions } from '../../utils/resource/constants'

export const defaultSelectedResource = { id: '', displayName: '' }
export const defaultState = {
    open: false,
    loading: false,
    search: '',
    collection: [],
    selectedAction: '',
    selectedResource: defaultSelectedResource,
}

export const resource = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
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

        case actionTypes.SET_RESEARCH_SEARCH:
            return {
                ...state,
                search: payload,
            }

        case actionTypes.EDIT_RESOURCE:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: resourceActions.EDIT,
            }

        case actionTypes.SHOW_SHARING_SETTINGS:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: resourceActions.SHARING_SETTINGS,
            }

        case actionTypes.ADD_RESOURCE:
            return {
                ...state,
                open: true,
                selectedAction: resourceActions.NEW,
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

        case actionTypes.RESET_CONTEXT_MENU:
            return {
                ...state,
                open: false,
                selectedAction: '',
                selectedResource: defaultSelectedResource,
            }

        case actionTypes.RESOURCE_ADD_LOADING_START:
            return {
                ...state,
                loading: true,
            }

        case actionTypes.RESOURCE_ADD_LOADING_SUCCESS:
            return {
                ...state,
                loading: false,
                open: false,
                selectedAction: '',
                selectedResource: defaultSelectedResource,
            }

        case actionTypes.RESOURCE_ADD_LOADING_ERROR:
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}
