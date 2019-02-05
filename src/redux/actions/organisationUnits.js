import { getOrganisationUnits } from '../../utils/api'

export const ACTION_TYPES = {
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
}

export const loadOrganisationUnitsSuccess = periodTypes => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_RECEIVED,
    payload: periodTypes,
})

export const loadOrganisationUnitsError = error => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_ERRORED,
    payload: error,
})

const loadOrganisationUnits = () => dispatch => {
    getOrganisationUnits()
        .then(organisationUnits =>
            dispatch(loadOrganisationUnitsSuccess(organisationUnits))
        )
        .catch(() =>
            dispatch(
                loadOrganisationUnitsError(
                    new Error('Could not load organisation units')
                )
            )
        )
}
export default loadOrganisationUnits
