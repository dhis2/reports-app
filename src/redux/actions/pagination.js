export const actionTypes = {
    GO_TO_NEXT_PAGE: 'GO_TO_NEXT_PAGE',
    GO_TO_PREV_PAGE: 'GO_TO_PREV_PAGE',
    SET_PAGINATION: 'SET_PAGINATION',
    RESET_PAGINATION: 'RESET_PAGINATION',
}

/**
 * @return {Object}
 */
export const goToNextPage = () => ({
    type: actionTypes.GO_TO_NEXT_PAGE,
})

/**
 * @return {Object}
 */
export const goToPrevPage = () => ({
    type: actionTypes.GO_TO_PREV_PAGE,
})

/**
 * @param {Object} pagination
 * @returns {Object}
 */
export const setPagination = pagination => ({
    type: actionTypes.SET_PAGINATION,
    payload: pagination,
})

/**
 * returns {Object}
 */
export const resetPagination = () => ({
    type: actionTypes.RESET_PAGINATION,
})
