import XLSX from 'xlsx'
import {
    getDataSetReports,
    getDimensions,
    postDataSetReportComment,
} from '../../utils/api'
import { selectDataSet as selectDataSetOriginal } from './dataSet'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
} from './htmlReport'

export const actionTypes = {
    SHOW_DATA_SET_REPORT_FORM: 'SHOW_DATA_SET_REPORT_FORM',
    DOWNLOAD_DATA_SET_REPORT_XLS: 'DOWNLOAD_DATA_SET_REPORT_XLS',
    LOADING_DIMENSIONS_START: 'LOADING_DIMENSIONS_START',
    LOADING_DIMENSIONS_SUCCESS: 'LOADING_DIMENSIONS_SUCCESS',
    LOADING_DIMENSIONS_ERROR: 'LOADING_DIMENSIONS_ERROR',
    SHARING_DATA_SET_REPORT_COMMENT_SUCCESS:
        'SHARING_DATA_SET_REPORT_COMMENT_SUCCESS',
    SHARING_DATA_SET_REPORT_COMMENT_START:
        'SHARING_DATA_SET_REPORT_COMMENT_START',
    SHARING_DATA_SET_REPORT_COMMENT_ERROR:
        'SHARING_DATA_SET_REPORT_COMMENT_ERROR',
    SET_DATA_SET_REPORT_COMMENT: 'SET_DATA_SET_REPORT_COMMENT',
    SELECT_DIMENSION_OPTION: 'SELECT_DIMENSION_OPTION',
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    TOGGLE_SHOW_OPTIONS: 'TOGGLE_SHOW_OPTIONS',
    TOGGLE_SELECTED_UNIT_ONLY: 'TOGGLE_SELECTED_UNIT_ONLY',
}

export const exportReportToXls = () => {
    const reportTables = document.querySelectorAll('#report-container table')
    const workbook = XLSX.utils.book_new()
    for (let i = 0; i < reportTables.length; i++) {
        const worksheet = XLSX.utils.table_to_sheet(reportTables[i])
        XLSX.utils.book_append_sheet(workbook, worksheet, `Worksheet ${i}`)
    }
    XLSX.writeFile(workbook, 'report.xlsx')

    return { type: actionTypes.DOWNLOAD_DATA_SET_REPORT_XLS }
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
        dataSetReport.selectedDimensionOptions,
        organisationUnits.selectedOptions,
        dataSet.selected.id,
        organisationUnits.selected.id,
        reportPeriod.selectedPeriod,
        dataSetReport.selectedUnitOnly
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(({ message }) => dispatch(loadingHtmlReportError(message)))
}

export const loadingDimensionsStart = () => ({
    type: actionTypes.LOADING_DIMENSIONS_START,
})

export const loadingDimensionsSuccess = dimensions => ({
    type: actionTypes.LOADING_DIMENSIONS_SUCCESS,
    payload: dimensions,
})

export const loadingDimensionsError = errorMessage => ({
    type: actionTypes.LOADING_DIMENSIONS_ERROR,
    payload: errorMessage,
})

export const loadDimensions = () => (dispatch, getState) => {
    dispatch(loadingDimensionsStart())

    const { dataSet } = getState()
    getDimensions(dataSet.selected.id)
        .then(response =>
            response.error
                ? Promise.reject(response.error)
                : Promise.resolve(response.dimensions)
        )
        .then(dimensions => dispatch(loadingDimensionsSuccess(dimensions)))
        .catch(({ message }) => dispatch(loadingDimensionsError(message)))
}

export const selectDataSet = dataSetId => (dispatch, getState) => {
    dispatch(selectDataSetOriginal(dataSetId))

    const { dataSet } = getState()
    dispatch(loadDimensions(dataSet.selected.id))
}

export const selectDimensionOption = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION_OPTION,
    payload: { dimension, value },
})

export const toggleSelectedUnitOnly = selectedUnitOnly => ({
    type: actionTypes.TOGGLE_SELECTED_UNIT_ONLY,
    payload: selectedUnitOnly,
})

export const sharingDataSetReportCommentStart = () => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_START,
})

export const sharingDataSetReportCommentSuccess = () => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_SUCCESS,
})

export const sharingDataSetReportCommentError = errorMessage => ({
    type: actionTypes.SHARING_DATA_SET_REPORT_COMMENT_ERROR,
    payload: errorMessage,
})

export const shareDataSetReportComment = comment => (dispatch, getState) => {
    const { dataSetReport, organisationUnits, reportPeriod } = getState()
    const dataSetId = dataSetReport.selectedDataSet.id
    const orgUnitId = organisationUnits.selected.id
    const period = reportPeriod.selectedPeriod

    dispatch(sharingDataSetReportCommentStart())
    postDataSetReportComment(dataSetId, orgUnitId, period, comment)
        .then(() => dispatch(sharingDataSetReportCommentSuccess()))
        .catch(({ error }) => dispatch(sharingDataSetReportCommentError(error)))
}

export const setDataSetReportComment = comment => ({
    type: actionTypes.SET_DATA_SET_REPORT_COMMENT,
    payload: comment,
})
