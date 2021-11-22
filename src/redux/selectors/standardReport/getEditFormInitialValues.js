import { matchPath } from 'react-router-dom'
import { createSelector } from 'reselect'
import {
    reportTypes,
    cacheStrategies,
} from '../../../pages/standard-report/standard.report.conf'
import { identity } from '../../../utils/boolean/identity'

export const getSelectedStandardReport = (state) =>
    state.standardReport.selectedReport

export const getIsEdit = (state) => {
    const match = matchPath(state.router.location.pathname, {
        path: '/standard-report/:mode',
    })
    return !!(match && match.params.mode === 'edit')
}

export const getEditFormInitialValues = createSelector(
    [getSelectedStandardReport, getIsEdit],
    (selectedReport, isEdit) => {
        if (isEdit) {
            if (selectedReport.id) {
                return {
                    id: selectedReport.id,
                    name: selectedReport.name,
                    type: selectedReport.type,
                    reportTable:
                        selectedReport.reportTable &&
                        selectedReport.reportTable.id
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
                        selectedReport.reportParams.reportingPeriod
                            ? 'reportingPeriod'
                            : '',
                        selectedReport.reportParams.organisationUnit
                            ? 'organisationUnit'
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
            reportTable: '',
        }
    }
)
