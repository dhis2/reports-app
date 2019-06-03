import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../actions/pagination'

const allActionTypes = { ...actionTypes, LOCATION_CHANGE }

export const DEFAULT_PAGE_SIZE = 50
export const defaultState = {
    pageSize: DEFAULT_PAGE_SIZE,
    page: 1,
    total: 0,
    pageCount: 1,
    nextPage: '',
    prevPage: '',
}

export const pagination = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case allActionTypes.GO_TO_NEXT_PAGE:
            return {
                ...state,
                page: state.page + 1,
            }

        case allActionTypes.GO_TO_PREV_PAGE:
            return {
                ...state,
                page: state.page - 1,
            }

        case allActionTypes.SET_PAGINATION:
            return payload

        case actionTypes.RESET_PAGINATION:
        case allActionTypes.LOCATION_CHANGE:
            return defaultState

        default:
            return state
    }
}
