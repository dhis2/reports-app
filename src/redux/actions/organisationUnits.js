import i18n from '@dhis2/d2-i18n'
import { getOrganisationUnits } from '../../utils/api.js'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage.js'
import { showErrorSnackBar } from './feedback.js'
import { loadGroupSetOptions } from './orgUnitGroupSets.js'

export const actionTypes = {
    ORGANISATION_UNITS_LOADING_START: 'ORGANISATION_UNITS_LOADING_START',
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
    ORGANISATION_UNIT_SELECTED: 'ORGANISATION_UNIT_SELECTED',
    ORGANISATION_UNIT_CLEARED: 'ORGANISATION_UNIT_CLEARED',
    ORGANISATION_UNITS_OPTION_SELECTED: 'ORGANISATION_UNITS_OPTION_SELECTED',
    TOGGLE_SHOW_OPTIONS: 'TOGGLE_SHOW_OPTIONS',
}

export const fallbackErrorMessage = i18n.t('Could not load organisation units')

/**
 * @returns {Object}
 */
export const loadOrganisationUnitsStart = () => ({
    type: actionTypes.ORGANISATION_UNITS_LOADING_START,
})
/**
 * @param {Object} periodTypes
 * @returns {Object}
 */
export const loadOrganisationUnitsSuccess = (organisationUnits) => ({
    type: actionTypes.ORGANISATION_UNITS_RECEIVED,
    payload: organisationUnits,
})

/**
 * @returns {Object}
 */
export const loadOrganisationUnitsError = () => ({
    type: actionTypes.ORGANISATION_UNITS_ERRORED,
})

/**
 * @param {Error} error
 * @returns {Function}
 */
export const loadOrganisationUnitsErrorDefaultMessage = i18n.t(
    'An error occurred while loading the organisation units!'
)
export const loadOrganisationUnitsErrorWithFeedback = (error) => (dispatch) => {
    const displayMessage = humanReadableErrorMessage(
        error,
        loadOrganisationUnitsErrorDefaultMessage
    )
    dispatch(showErrorSnackBar(displayMessage))
    dispatch(loadOrganisationUnitsError())
}

export const loadOrganisationUnits = () => (dispatch) => {
    dispatch(loadOrganisationUnitsStart())
    return getOrganisationUnits()
        .then((organisationUnits) =>
            dispatch(loadOrganisationUnitsSuccess(organisationUnits))
        )
        .catch((error) => {
            console.error(error)
            dispatch(loadOrganisationUnitsErrorWithFeedback(error))
        })
}

export const selectOrganisationUnit = (
    _event,
    { id, path, displayName, children }
) => ({
    type: actionTypes.ORGANISATION_UNIT_SELECTED,
    payload: { id, path, displayName, children },
})

export const selectOrgUnitOption = (id, value) => ({
    type: actionTypes.ORGANISATION_UNITS_OPTION_SELECTED,
    payload: { id, value },
})

export const toggleShowOptions = () => (dispatch, getState) => {
    const { orgUnitGroupSets } = getState()

    dispatch({ type: actionTypes.TOGGLE_SHOW_OPTIONS })

    if (orgUnitGroupSets.collection.length === 0) {
        dispatch(loadGroupSetOptions())
    }
}

export const clearSelectedOrgUnit = () => ({
    type: actionTypes.ORGANISATION_UNIT_CLEARED,
})
