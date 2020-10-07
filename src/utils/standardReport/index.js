import omitBy from 'lodash.omitby'
import { isFalsy } from '../boolean/isFalsy'
import { reportTypes } from '../../pages/standard-report/standard.report.conf'
import { getSelectedOrgUnit } from '../../redux/selectors/organisationUnit/getSelectedOrgUnit'
import { getSelectedReportPeriod } from '../../redux/selectors/reportPeriod/getSelectedReportPeriod'
import { getPeriodStartDate } from '../periods/periodTypes'

export const extractRequiredReportParams = reportParams =>
    omitBy(
        {
            period: reportParams.reportingPeriod,
            organisationUnit:
                reportParams.organisationUnit ||
                reportParams.parentOrganisationUnit ||
                reportParams.grandParentOrganisationUnit,
        },
        isFalsy
    )

export const isHtmlReport = report => report.type === reportTypes.HTML
export const isJasperReportTableReport = report =>
    report.type === reportTypes.JASPER_REPORT_TABLE

export const getReportParams = report =>
    (report.reportTable && report.reportTable.reportParams) ||
    report.reportParams

export const appendOrgUnitsAndReportPeriodToQueryString = (
    state,
    baseStr = ''
) => {
    const { standardReport, organisationUnits, reportPeriod } = state
    const { reportParams } = standardReport

    if (reportParams.organisationUnit) {
        baseStr += `&ou=${organisationUnits.selected.id}`
    }

    if (reportParams.period) {
        const startDate = getPeriodStartDate(reportPeriod.selectedPeriod)

        baseStr += `&pe=${reportPeriod.selectedPeriod}`

        if (startDate) {
            baseStr += `&date=${startDate}`
        }
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

export const processCheckboxValues = (formSelectedKeys, stateValues) => {
    if (!stateValues) {
        return {}
    }

    const selectedKeys = new Set(formSelectedKeys)
    return Object.keys(stateValues).reduce((acc, key) => {
        acc[key] = selectedKeys.has(key)
        return acc
    }, {})
}
