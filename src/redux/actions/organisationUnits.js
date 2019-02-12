import i18n from '@dhis2/d2-i18n'
import { getOrganisationUnits } from '../../utils/api'
import humanReadableErrorMessage from '../../utils/humanReadableErrorMessage'

export const ACTION_TYPES = {
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
    ORGANISATION_UNIT_SELECTED: 'ORGANISATION_UNIT_SELECTED',
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
