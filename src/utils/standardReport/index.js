import omitBy from 'lodash.omitby'
import parsePeriod from 'd2/period/parser'
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
    report.reportTable ? report.reportTable.reportParams : report.reportParams

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
        baseStr += `&pe=${reportPeriod.selectedPeriod}`
        try {
            const period = parsePeriod(reportPeriod.selectedPeriod)
            baseStr += `&date=${period.startDate}`
        } catch (error) {
            // ignore
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
    const selectedKeys = new Set(formSelectedKeys)

    return Object.keys(stateValues).reduce((acc, key) => {
        const formValue = selectedKeys.has(key)
        const stateValue = stateValues[key]

        if (formValue !== stateValue) {
            acc[key] = formValue
        }
        return acc
    }, {})
}
