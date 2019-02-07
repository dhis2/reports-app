import { connect } from 'react-redux'
import {
    exportReportToXls,
    loadHtmlReport,
    selectDataSet,
    selectDimensionOption,
    selectOrgUnitOption,
    toggleSelectedUnitOnly,
    showDataSetReportForm,
    toggleShowOptions,
} from '../../redux/actions/dataSetReport'

const mapStateToProps = ({
    dataSetReport,
    organisationUnits,
    reportPeriod,
}) => ({
    showForm: dataSetReport.showForm,
    reportHtml: dataSetReport.reportHtml,
    dataSetDimensions: dataSetReport.dataSetDimensions,
    selectedDataSet: dataSetReport.selectedDataSet,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedDimensionOptions: dataSetReport.selectedDimensionOptions,
    selectedOrgUnitGroupOptions: dataSetReport.selectedOrgUnitGroupOptions,
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
})

export const connectDataSetReport = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
