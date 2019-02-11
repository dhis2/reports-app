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
} from '../../redux/actions/dataSetReport'

const mapStateToProps = ({
    dataSet,
    dataSetReport,
    organisationUnits,
    reportPeriod,
    htmlReport,
}) => ({
    showForm: dataSetReport.showForm,
    reportHtml: htmlReport.reportHtml,
    reportComment: dataSetReport.reportComment,
    dataSetDimensions: dataSetReport.dataSetDimensions,
    selectedDataSet: dataSet.selected,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedDimensionOptions: dataSetReport.selectedDimensionOptions,
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
    selectDataSet: e => dispatch(selectDataSet(e.target.value)),
    selectDimensionOption: (id, evt) =>
        dispatch(selectDimensionOption(id, evt.target.value)),
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
