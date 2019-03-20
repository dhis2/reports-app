import { getSelectedOrgUnit } from '../../redux/selectors/organisationUnit/getSelectedOrgUnit'
import { getSelectedReportPeriod } from '../../redux/selectors/reportPeriod/getSelectedReportPeriod'

export const validateRequiredParams = (state, requiredParams) => {
    const errors = []

    if (requiredParams.organisationUnit && !getSelectedOrgUnit(state)) {
        errors.push('You need to select an organisation unit')
    }

    if (requiredParams.period && !getSelectedReportPeriod(state)) {
        errors.push('You need to select a period')
    }

    return errors
}
