import { getOrganisationUnits } from '../../utils/api'
import i18n from '@dhis2/d2-i18n'

export const ACTION_TYPES = {
    ORGANISATION_UNITS_RECEIVED: 'ORGANISATION_UNITS_RECEIVED',
    ORGANISATION_UNITS_ERRORED: 'ORGANISATION_UNITS_ERRORED',
    ORGANISATION_UNIT_SELECTED: 'ORGANISATION_UNIT_SELECTED',
    ORGANISATION_UNITS_OPTION_SELECTED: 'ORGANISATION_UNITS_OPTION_SELECTED',
}

export const loadOrganisationUnitsSuccess = periodTypes => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_RECEIVED,
    payload: periodTypes,
})

export const loadOrganisationUnitsError = () => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_ERRORED,
    payload: i18n.t('Could not load organisation units'),
})

export const loadOrganisationUnits = () => dispatch => {
    getOrganisationUnits()
        .then(orgUnits => dispatch(loadOrganisationUnitsSuccess(orgUnits)))
        .catch(() => dispatch(loadOrganisationUnitsError()))
}

export const selectOrganisationUnit = (_event, { id, path, displayName }) => ({
    type: ACTION_TYPES.ORGANISATION_UNIT_SELECTED,
    payload: { id, path, displayName },
})

export const selectOrgUnitOption = (id, value) => ({
    type: ACTION_TYPES.ORGANISATION_UNITS_OPTION_SELECTED,
    payload: { id, value },
})

export const toggleShowOptions = () => ({
    type: actionTypes.TOGGLE_SHOW_OPTIONS,
})
