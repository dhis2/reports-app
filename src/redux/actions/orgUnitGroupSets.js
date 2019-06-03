import i18n from '@dhis2/d2-i18n'
import { getOrgUnitGroupSets } from '../../utils/api'
import { showErrorSnackBar } from './feedback'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'

export const actionTypes = {
    LOADING_GROUP_SETS_START: 'LOADING_GROUP_SETS_START',
    LOADING_GROUP_SETS_SUCCESS: 'LOADING_GROUP_SETS_SUCCESS',
    LOADING_GROUP_SETS_ERROR: 'LOADING_GROUP_SETS_ERROR',
    SET_GROUP_SET: 'SET_GROUP_SET',
}

/**
 * @returns {Object}
 */
export const loadingGroupSetsStart = () => ({
    type: actionTypes.LOADING_GROUP_SETS_START,
})

/**
 * @param {Array} groupSets
 * @returns {Object}
 */
export const loadingGroupSetsSuccess = groupSets => ({
    type: actionTypes.LOADING_GROUP_SETS_SUCCESS,
    payload: groupSets,
})

/**
 * @param {Error} error
 * @returns {Object}
 */
export const loadingGroupSetsErrorDefaultMessage = i18n.t(
    'An error occurred while loading the group sets!'
)
export const loadingGroupSetsError = error => dispatch => {
    const displayMessage = humanReadableErrorMessage(
        error,
        loadingGroupSetsErrorDefaultMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch({
        type: actionTypes.LOADING_GROUP_SETS_ERROR,
        payload: displayMessage,
    })
}

/**
 * @returns {Function}
 */
export const loadGroupSetOptions = () => dispatch => {
    dispatch(loadingGroupSetsStart())

    return getOrgUnitGroupSets()
        .then(response => dispatch(loadingGroupSetsSuccess(response.toArray())))
        .catch(error => dispatch(loadingGroupSetsError(error)))
}

/**
 * @param {string} groupSetId
 * @return {Object}
 */
export const setGroupSet = groupSetId => ({
    type: actionTypes.SET_GROUP_SET,
    payload: groupSetId,
})
