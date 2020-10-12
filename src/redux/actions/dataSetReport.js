import { selectDataSet as selectDataSetOriginal } from './dataSet'
import { loadDimensions } from './dataSetDimensions'
import { getDataSetReport, postDataSetReportComment } from '../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccessWithFeedback,
    loadingReportDataErrorWithFeedback,
    sharingReportCommentStartWithFeedback,
    sharingReportCommentSuccessWithFeedback,
    sharingReportCommentErrorWithFeedback,
} from './reportData'

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

export const loadReportData = () => (dispatch, getState) => {
    dispatch(loadingReportDataStart())

    const {
        dataSet,
        dataSetDimensions,
        dataSetReport,
        organisationUnits,
        reportPeriod,
        dataSetNoOfSignatuesReport,
    } = getState()

    return getDataSetReport({
        dataSet: dataSet.selected,
        dataSetDimensions: dataSetDimensions.selected,
        orgUnitGroupsOptions: organisationUnits.selectedOptions,
        orgUnit: organisationUnits.selected.id,
        period: reportPeriod.selectedPeriod,
        selectedUnitOnly: dataSetReport.selectedUnitOnly,
        noOfSignatures: dataSetNoOfSignatuesReport.selected.id,
    })
        .then(response =>
            dispatch(loadingReportDataSuccessWithFeedback(response))
        )
        .catch(error => dispatch(loadingReportDataErrorWithFeedback(error)))
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
