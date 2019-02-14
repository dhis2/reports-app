import { getDataSetReports, postDataSetReportComment } from '../../utils/api'
import {
    selectDataSet as selectDataSetOriginal,
    loadDimensions,
} from './dataSet'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
    sharingReportCommentStart,
    sharingReportCommentSuccess,
    sharingReportCommentError,
} from './htmlReport'

export const actionTypes = {
    SHOW_DATA_SET_REPORT_FORM: 'SHOW_DATA_SET_REPORT_FORM',
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    TOGGLE_SHOW_OPTIONS: 'TOGGLE_SHOW_OPTIONS',
    TOGGLE_SELECTED_UNIT_ONLY: 'TOGGLE_SELECTED_UNIT_ONLY',
}

export const showDataSetReportForm = () => ({
    type: actionTypes.SHOW_DATA_SET_REPORT_FORM,
})

export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(loadingHtmlReportStart())

    const {
        dataSet,
        dataSetReport,
        organisationUnits,
        reportPeriod,
    } = getState()

    getDataSetReports(
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

export const selectDataSet = dataSetId => (dispatch, getState) => {
    dispatch(selectDataSetOriginal(dataSetId))

    const { dataSet } = getState()
    dispatch(loadDimensions(dataSet.selected.id))
}

export const toggleSelectedUnitOnly = selectedUnitOnly => ({
    type: actionTypes.TOGGLE_SELECTED_UNIT_ONLY,
    payload: selectedUnitOnly,
})

export const shareDataSetReportComment = comment => (dispatch, getState) => {
    const { dataSet, organisationUnits, reportPeriod } = getState()
    const dataSetId = dataSet.selected.id
    const orgUnitId = organisationUnits.selected.id
    const period = reportPeriod.selectedPeriod

    dispatch(sharingReportCommentStart())
    postDataSetReportComment(dataSetId, orgUnitId, period, comment)
        .then(() => dispatch(sharingReportCommentSuccess()))
        .catch(error => dispatch(sharingReportCommentError(error)))
}
