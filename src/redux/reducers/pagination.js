import { actionTypes } from '../actions/pagination'

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
        case actionTypes.GO_TO_NEXT_PAGE:
            return {
                ...state,
                page: state.page + 1,
            }

        case actionTypes.GO_TO_PREV_PAGE:
            return {
                ...state,
                page: state.page - 1,
            }

        case actionTypes.SET_PAGINATION:
            return payload

        default:
            return state
    }
}
