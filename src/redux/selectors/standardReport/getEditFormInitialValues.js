import {
    reportTypes,
    cacheStrategies,
} from '../../../pages/standard-report/standard.report.conf'
import { identity } from '../../../utils/boolean/identity'

export const getEditFormInitialValues = state => {
    const { standardReport } = state

    if (standardReport.selectedReport.cacheStrategy) {
        const { selectedReport } = standardReport
        return {
            id: selectedReport.id,
            name: selectedReport.name,
            type: selectedReport.type,
            reportTable:
                selectedReport.reportTable && selectedReport.reportTable.id
                    ? selectedReport.reportTable.id
                    : '',
            relativePeriods: Object.keys(selectedReport.relativePeriods).reduce(
                (acc, cur) =>
                    selectedReport.relativePeriods[cur] ? [...acc, cur] : acc,
                []
            ),
            reportParams: [
                selectedReport.reportParams.paramReportingPeriod
                    ? 'paramReportingPeriod'
                    : '',
                selectedReport.reportParams.paramOrganisationUnit
                    ? 'paramOrganisationUnit'
                    : '',
            ].filter(identity),
            cacheStrategy: selectedReport.cacheStrategy,
        }
    }

    return {
        type: reportTypes.JASPER_REPORT_TABLE,
        cacheStrategy: cacheStrategies[0].value,
        reportTable: state.standardReportTables.collection.length
            ? state.standardReportTables.collection[0].value
            : '',
    }
}
