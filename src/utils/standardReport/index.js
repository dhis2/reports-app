import omitBy from 'lodash.omitby'
import { isFalsy } from '../boolean/isFalsy'
import { reportTypes } from '../../pages/standard-report/standard.report.conf'
import { getSelectedOrgUnit } from '../../redux/selectors/organisationUnit/getSelectedOrgUnit'
import { getSelectedReportPeriod } from '../../redux/selectors/reportPeriod/getSelectedReportPeriod'

export const extractRequiredReportParams = reportParams =>
    omitBy(
        {
            period: reportParams.paramReportingPeriod,
            organisationUnit:
                reportParams.paramOrganisationUnit ||
                reportParams.paramParentOrganisationUnit ||
                reportParams.paramGrandParentOrganisationUnit,
        },
        isFalsy
    )

export const isHtmlReport = report => report.type === reportTypes.HTML

export const getReportParams = report =>
    isHtmlReport(report) ? report.reportParams : report.reportTable.reportParams

export const appendOrgUnitsAndReportPeriodToQueryString = (
    state,
    baseStr = ''
) => {
    const { standardReport, organisationUnits, reportPeriod } = state
    const { reportParams } = standardReport
    console.log(reportParams, organisationUnits, reportPeriod)
    if (reportParams.organisationUnit) {
        baseStr += `&ou=${organisationUnits.selected.id}`
    }

    if (reportParams.period) {
        baseStr += `&p=${reportPeriod.selectedPeriod}`
    }

    return baseStr ? `?${baseStr}` : baseStr
}

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
