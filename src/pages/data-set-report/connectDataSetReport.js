import { connect } from 'react-redux'
import {
    exportReportToXls,
    loadHtmlReport,
    selectDataSet,
    selectDimensionOption,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
    setDataSetReportComment,
    showDataSetReportForm,
    toggleShowOptions,
} from '../../redux/actions/dataSetReport'
import { selectOrgUnitOption } from '../../redux/actions/organisationUnits'

const mapStateToProps = ({
    dataSetReport,
    organisationUnits,
    reportPeriod,
}) => ({
    showForm: dataSetReport.showForm,
    reportHtml: dataSetReport.reportHtml,
    reportComment: dataSetReport.reportComment,
    dataSetDimensions: dataSetReport.dataSetDimensions,
    selectedDataSet: dataSetReport.selectedDataSet,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedDimensionOptions: dataSetReport.selectedDimensionOptions,
    selectedOrgUnitGroupOptions: organisationUnits.selectedOptions,
    selectedOrgUnit: organisationUnits.selected,
    selectedPeriod: reportPeriod.selectedPeriod,
    showOptions: dataSetReport.showOptions,
    loading: dataSetReport.loading,
    showFeedback: dataSetReport.showFeedback,
    feedbackConf: dataSetReport.feedbackConf,
})

const mapDispatchToProps = dispatch => ({
    exportReportToXls: () => dispatch(exportReportToXls()),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
    showDataSetReportForm: () => dispatch(showDataSetReportForm()),
    toggleShowOptions: () => dispatch(toggleShowOptions()),
    selectDataSet: dataSet => dispatch(selectDataSet(dataSet)),
    selectDimensionOption: (id, evt) =>
        dispatch(selectDimensionOption(id, evt.target.value)),
    selectOrgUnitOption: (id, event) =>
        dispatch(selectOrgUnitOption(id, event.target.value)),
    toggleSelectedUnitOnly: (e, selectedUnitOnly) =>
        dispatch(toggleSelectedUnitOnly(selectedUnitOnly)),
    shareDataSetReportComment: comment =>
        dispatch(shareDataSetReportComment(comment)),
    setDataSetReportComment: comment =>
        dispatch(setDataSetReportComment(comment)),
})

export const connectDataSetReport = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
