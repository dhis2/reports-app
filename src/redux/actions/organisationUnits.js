import i18n from '@dhis2/d2-i18n'
import { getOrganisationUnits, getOrgUnitGroupSets } from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'

export const ACTION_TYPES = {
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
    ORGANISATION_UNIT_SELECTED: 'ORGANISATION_UNIT_SELECTED',
    ORGANISATION_UNITS_OPTION_SELECTED: 'ORGANISATION_UNITS_OPTION_SELECTED',
    TOGGLE_SHOW_OPTIONS: 'TOGGLE_SHOW_OPTIONS',
    LOADING_GROUP_SETS_START: 'LOADING_GROUP_SETS_START',
    LOADING_GROUP_SETS_SUCCESS: 'LOADING_GROUP_SETS_SUCCESS',
    LOADING_GROUP_SETS_ERROR: 'LOADING_GROUP_SETS_ERROR',
    SET_GROUP_SET: 'SET_GROUP_SET',
}

export const fallbackErrorMessage = i18n.t('Could not load organisation units')

export const loadOrganisationUnitsSuccess = periodTypes => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_RECEIVED,
    payload: periodTypes,
})

export const loadOrganisationUnitsError = errorMessage => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_ERRORED,
    payload: errorMessage,
})

export const loadOrganisationUnits = () => dispatch =>
    getOrganisationUnits()
        .then(organisationUnits =>
            dispatch(loadOrganisationUnitsSuccess(organisationUnits))
        )
        .catch(error => {
            console.error(error)
            dispatch(
                loadOrganisationUnitsError(
                    humanReadableErrorMessage(error, fallbackErrorMessage)
                )
            )
        })

export const selectOrganisationUnit = (_event, { id, path, displayName }) => ({
    type: ACTION_TYPES.ORGANISATION_UNIT_SELECTED,
    payload: { id, path, displayName },
})

export const selectOrgUnitOption = (id, value) => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_OPTION_SELECTED,
    payload: { id, value },
})

export const toggleShowOptions = () => ({
    type: ACTION_TYPES.TOGGLE_SHOW_OPTIONS,
})

/**
 * @returns {Object}
 */
export const loadingGroupSetsStart = () => ({
    type: ACTION_TYPES.LOADING_GROUP_SETS_START,
})

/**
 * @param {Array} groupSets
 * @returns {Object}
 */
export const loadingGroupSetsSuccess = groupSets => ({
    type: ACTION_TYPES.LOADING_GROUP_SETS_START,
    payload: groupSets,
})

/**
 * @param {string} errorMessage
 * @returns {Object}
 */
export const loadingGroupSetsError = errorMessage => ({
    type: ACTION_TYPES.LOADING_GROUP_SETS_START,
    payload: errorMessage,
})

/**
 * @returns {Function}
 */
export const loadGroupSetOptions = () => dispatch => {
    dispatch(loadingGroupSetsStart())

    getOrgUnitGroupSets()
        .then(response => dispatch(loadingGroupSetsSuccess(response.toArray())))
        .catch(({ message }) => dispatch(loadingGroupSetsError(message)))
}

/**
 * @param {string} groupSetId
 * @return {Object}
 */
export const setGroupSet = groupSetId => ({
    type: ACTION_TYPES.SET_GROUP_SET,
    payload: groupSetId,
})
