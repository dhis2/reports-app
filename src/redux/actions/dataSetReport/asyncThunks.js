import { getDataSetReports, postDataSetReportComment } from '../../../utils/api'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
    sharingReportCommentStart,
    sharingReportCommentSuccess,
    sharingReportCommentError,
} from '../htmlReport'

export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStart())

    const {
        dataSet,
        dataSetReport,
        organisationUnits,
        reportPeriod,
    } = getState()

    return getDataSetReports(
        dataSet.selectedDimensionOptions,
        organisationUnits.selectedOptions,
        dataSet.selected.id,
        organisationUnits.selected.id,
        reportPeriod.selectedPeriod,
        dataSetReport.selectedUnitOnly
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(error => dispatch(loadingHtmlReportError(error)))
}

export const shareDataSetReportComment = comment => (dispatch, getState) => {
    const { dataSet, organisationUnits, reportPeriod } = getState()
    const dataSetId = dataSet.selected.id
    const orgUnitId = organisationUnits.selected.id
    const period = reportPeriod.selectedPeriod

    dispatch(sharingReportCommentStart())
    return postDataSetReportComment(dataSetId, orgUnitId, period, comment)
        .then(() => dispatch(sharingReportCommentSuccess()))
        .catch(error => dispatch(sharingReportCommentError(error)))
}
