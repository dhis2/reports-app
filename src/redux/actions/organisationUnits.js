import { getOrganisationUnits } from '../../utils/api'
import i18n from '@dhis2/d2-i18n'

export const ACTION_TYPES = {
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
}

export const loadOrganisationUnitsSuccess = periodTypes => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_RECEIVED,
    payload: periodTypes,
})

export const loadOrganisationUnitsError = () => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_ERRORED,
    payload: i18n.t('Could not load organisation units'),
})

const loadOrganisationUnits = () => dispatch => {
    getOrganisationUnits()
        .then(organisationUnits =>
            dispatch(loadOrganisationUnitsSuccess(organisationUnits))
        )
        .catch(() => dispatch(loadOrganisationUnitsError()))
}
export default loadOrganisationUnits
