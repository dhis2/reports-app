import { actionTypes } from '../actions/reportingRateSummary'
import i18n from '../../utils/i18n/locales'

const BASED_ON_OPTIONS = [
    {
        id: 'registration',
        displayName: i18n.t('Complete data set registrations'),
    },
    {
        id: 'compulsory',
        displayName: i18n.t('Compulsory data elements'),
    },
]

export const defaultState = {
    selectedCriteria: BASED_ON_OPTIONS[0].id,
    criteriaOptions: BASED_ON_OPTIONS,
}

export const reportingRateSummary = (
    state = defaultState,
    { type, payload } = {}
) => {
    switch (type) {
        case actionTypes.SET_SELECTED_CRITERIA:
            return { ...state, selectedCriteria: payload }

        default:
            return state
    }
}
