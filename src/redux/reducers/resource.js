import { actionTypes } from '../actions/resource'
import {
    ADD_NEW_RESOURCE_ACTION,
    CONTEXT_MENU_ACTION,
} from '../../pages/resource/resource.conf'

export const defaultState = {
    open: false,
    loading: false,
    search: '',
    collection: [],
    selectedAction: '',
    selectedResource: { id: '', displayName: '' },
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
            console.log('SET_SEARCH', payload)
            return {
                ...state,
                search: payload,
            }

        case actionTypes.VIEW_RESOURCE:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: CONTEXT_MENU_ACTION.VIEW,
            }

        case actionTypes.EDIT_RESOURCE:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: CONTEXT_MENU_ACTION.EDIT,
            }

        case actionTypes.SHOW_SHARING_SETTINGS:
            return {
                ...state,
                open: true,
                selectedResource: payload,
                selectedAction: ADD_NEW_RESOURCE_ACTION.SHARING_SETTINGS,
            }

        case actionTypes.ADD_RESOURCE:
            return {
                ...state,
                open: true,
                selectedAction: ADD_NEW_RESOURCE_ACTION,
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
                open: false,
                selectedAction: '',
                selectedResource: {},
            }

        default:
            return state
    }
}
