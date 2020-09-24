import { flattenedRelativePeriods } from '../../../utils/periods/relativePeriods'
import {
    fixedPeriodTranslations,
    relativePeriodsThatAreActuallyFixed,
} from '../../../utils/periods/fixedPeriods'
import { isJasperReportTableReport } from '../../../utils/standardReport'

export const getFilteredPeriodTypes = state => {
    const fixedPeriodTypes = state.reportPeriod.collection.map(periodType => ({
        id: periodType.name,
        displayName: fixedPeriodTranslations[periodType.name],
    }))

    if (!state.standardReport.showReportParams) {
        return fixedPeriodTypes
    }

    // In report params modal we want to show a mix of fixed period types and relative periods
    const report = state.standardReport.selectedReport
    const reportConfig = isJasperReportTableReport(report)
        ? report.reportTable
        : report

    const periods = reportConfig.relativePeriods || {}

    return Object.keys(periods).reduce((acc, periodKey) => {
        const isSelected = periods[periodKey]

        if (isSelected) {
            const fixedPeriodTypes =
                relativePeriodsThatAreActuallyFixed[periodKey]

            if (fixedPeriodTypes) {
                fixedPeriodTypes.forEach(periodKey => {
                    acc.push({
                        id: periodKey,
                        displayName: fixedPeriodTranslations[periodKey],
                    })
                })
            } else {
                acc.push({
                    ...flattenedRelativePeriods[periodKey],
                    isRelative: true,
                })
            }
        }
        return acc
    }, [])
}
