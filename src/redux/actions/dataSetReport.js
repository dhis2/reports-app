import XLSX from 'xlsx'
import { getDataSetReports } from '../../utils/api'

export const actionTypes = {
    SHOW_DATA_SET_REPORT_FORM: 'SHOW_DATA_SET_REPORT_FORM',
    DOWNLOAD_DATA_SET_REPORT_XLS: 'DOWNLOAD_DATA_SET_REPORT_XLS',
    LOADING_HTML_REPORT_START: 'LOADING_HTML_REPORT_START',
    LOADING_HTML_REPORT_SUCCESS: 'LOADING_HTML_REPORT_SUCCESS',
    LOADING_HTML_REPORT_ERROR: 'LOADING_HTML_REPORT_ERROR',
    SELECT_DIMENSION: 'SELECT_DIMENSION',
    SELECT_DATA_SET: 'SELECT_DATA_SET',
    SELECT_ORG_UNIT: 'SELECT_ORG_UNIT',
    SELECT_PERIOD: 'SELECT_PERIOD',
    SELECT_OPTIONS_FOR_ORGANISATION_UNIT_GROUP_SETS:
        'SELECT_OPTIONS_FOR_ORGANISATION_UNIT_GROUP_SETS',
    TOGGLE_SHOW_OPTIONS: 'TOGGLE_SHOW_OPTIONS',
    SET_SELECTED_UNIT_ONLY: 'SET_SELECTED_UNIT_ONLY',
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

export const startLoadingHtmlReport = () => ({
    type: actionTypes.LOADING_HTML_REPORT_START,
})

export const loadingHtmlReportSuccess = htmlReport => ({
    type: actionTypes.LOADING_HTML_REPORT_SUCCESS,
    payload: htmlReport,
})

export const loadingHtmlReportError = errorMessage => ({
    type: actionTypes.LOADING_HTML_REPORT_ERROR,
    payload: errorMessage,
})

export const loadHtmlReport = () => (dispatch, getState) => {
    dispatch(startLoadingHtmlReport())

    const { dataSetReport } = getState()
    console.log(
        'selectedOptionsForDimensions',
        'selectedOptionsForOrganisationUnitGroupSets',
        'selectedDataSet.id',
        'selectedOrgUnit',
        'selectedPeriod',
        'selectedUnitOnly',

        dataSetReport.selectedOptionsForDimensions,
        dataSetReport.selectedOptionsForOrganisationUnitGroupSets,
        dataSetReport.selectedDataSet.id,
        dataSetReport.selectedOrgUnit,
        dataSetReport.selectedPeriod,
        dataSetReport.selectedUnitOnly
    )
    getDataSetReports(
        dataSetReport.selectedOptionsForDimensions,
        dataSetReport.selectedOptionsForOrganisationUnitGroupSets,
        dataSetReport.selectedDataSet.id,
        dataSetReport.selectedOrgUnit,
        dataSetReport.selectedPeriod,
        dataSetReport.selectedUnitOnly
    )
        .then(response => dispatch(loadingHtmlReportSuccess(response)))
        .catch(({ message }) => dispatch(loadingHtmlReportError(message)))
}

export const toggleShowOptions = () => ({
    type: actionTypes.TOGGLE_SHOW_OPTIONS,
})

export const selectOrgUnit = orgUnit => ({
    type: actionTypes.SELECT_ORG_UNIT,
    payload: orgUnit,
})

export const selectDataSet = dataSet => ({
    type: actionTypes.SELECT_DATA_SET,
    payload: dataSet,
})

export const selectDimension = (dimension, value) => ({
    type: actionTypes.SELECT_DIMENSION,
    payload: { dimension, value },
})

export const selectPeriod = period => ({
    type: actionTypes.SELECT_PERIOD,
    payload: period,
})

export const setSelectedUnitOnly = selectedUnitOnly => ({
    type: actionTypes.SET_SELECTED_UNIT_ONLY,
    payload: selectedUnitOnly,
})

export const selectOptionsForOrganisationUnitGroupSets = (id, value) => ({
    type: actionTypes.SELECT_OPTIONS_FOR_ORGANISATION_UNIT_GROUP_SETS,
    payload: { id, value },
})
