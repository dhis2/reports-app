import {
    reportTypes,
    cacheStrategies,
} from '../../../pages/standard-report/standard.report.conf'
import { identity } from '../../../utils/boolean/identity'

export const getEditFormInitialValues = (state, isEdit) => {
    const { standardReport } = state

    if (isEdit) {
        if (standardReport.selectedReport.id) {
            // edit mode and report has loaded
            const { selectedReport } = standardReport
            return {
                id: selectedReport.id,
                name: selectedReport.name,
                type: selectedReport.type,
                reportTable:
                    selectedReport.reportTable && selectedReport.reportTable.id
                        ? selectedReport.reportTable.id
                        : '',
                relativePeriods: Object.keys(
                    selectedReport.relativePeriods
                ).reduce(
                    (acc, cur) =>
                        selectedReport.relativePeriods[cur]
                            ? [...acc, cur]
                            : acc,
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
        } else {
            // edit mode, but report hasn't loaded yet
            return {}
        }
    }

    // create mode
    return {
        type: reportTypes.JASPER_REPORT_TABLE,
        cacheStrategy: cacheStrategies[1].value,
        reportTable: state.standardReportTables.collection.length
            ? state.standardReportTables.collection[0].value
            : '',
    }
}
