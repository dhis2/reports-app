import { selectDataSet as selectDataSetOriginal } from './dataSet'
import { loadDimensions } from './dataSetDimensions'
import { getDataSetReports, postDataSetReportComment } from '../../utils/api'
import {
    loadingHtmlReportStartWithFeedback,
    loadingHtmlReportSuccessWithFeedback,
    loadingHtmlReportErrorWithFeedback,
    sharingReportCommentStartWithFeedback,
    sharingReportCommentSuccessWithFeedback,
    sharingReportCommentErrorWithFeedback,
} from './htmlReport'

export const actionTypes = {
    SHOW_DATA_SET_REPORT_FORM: 'SHOW_DATA_SET_REPORT_FORM',
    TOGGLE_SELECTED_UNIT_ONLY: 'TOGGLE_SELECTED_UNIT_ONLY',
}

export const selectDataSet = dataSetId => (dispatch, getState) => {
    dispatch(selectDataSetOriginal(dataSetId))

    const { dataSet } = getState()
    dispatch(loadDimensions(dataSet.selected.id))
}

export const toggleSelectedUnitOnly = selectedUnitOnly => ({
    type: actionTypes.TOGGLE_SELECTED_UNIT_ONLY,
    payload: selectedUnitOnly,
})

export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStartWithFeedback())

    const {
        dataSet,
        dataSetDimensions,
        dataSetReport,
        organisationUnits,
        reportPeriod,
    } = getState()

    return getDataSetReports(
        dataSetDimensions.selected,
        organisationUnits.selectedOptions,
        dataSet.selected.id,
        organisationUnits.selected.id,
        reportPeriod.selectedPeriod,
        dataSetReport.selectedUnitOnly
    )
        .then(response =>
            dispatch(loadingHtmlReportSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingHtmlReportErrorWithFeedback(error)))
}

export const shareDataSetReportComment = comment => (dispatch, getState) => {
    const { dataSet, organisationUnits, reportPeriod } = getState()
    const dataSetId = dataSet.selected.id
    const orgUnitId = organisationUnits.selected.id
    const period = reportPeriod.selectedPeriod

    dispatch(sharingReportCommentStartWithFeedback())
    return postDataSetReportComment(dataSetId, orgUnitId, period, comment)
        .then(() => dispatch(sharingReportCommentSuccessWithFeedback()))
        .catch(error => dispatch(sharingReportCommentErrorWithFeedback(error)))
}
