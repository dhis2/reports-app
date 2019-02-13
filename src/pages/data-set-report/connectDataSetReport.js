import { connect } from 'react-redux'
import {
    loadHtmlReport,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
    showDataSetReportForm,
} from '../../redux/actions/dataSetReport'
import {
    exportReportToXls,
    setReportComment,
} from '../../redux/actions/htmlReport'
import { selectDimensionOption } from '../../redux/actions/dataSet'

const mapStateToProps = ({
    dataSet,
    dataSetReport,
    organisationUnits,
    reportPeriod,
    htmlReport,
}) => ({
    showForm: dataSetReport.showForm,
    reportHtml: htmlReport.content,
    reportComment: htmlReport.comment,
    dataSetDimensions: dataSet.dimensionOptions,
    selectedDataSet: dataSet.selected,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedDimensionOptions: dataSet.selectedDimensionOptions,
    selectedOrgUnit: organisationUnits.selected,
    selectedPeriod: reportPeriod.selectedPeriod,
    showOptions: dataSetReport.showOptions,
    loading: dataSetReport.loading,
    showFeedback: dataSetReport.showFeedback,
    feedbackConf: dataSetReport.feedbackConf,
})

const mapDispatchToProps = dispatch => ({
    exportReportToXls: () =>
        dispatch(
            exportReportToXls(
                document.querySelectorAll('#report-container table')
            )
        ),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
    showDataSetReportForm: () => dispatch(showDataSetReportForm()),
    selectDataSet: e => dispatch(selectDataSet(e.target.value)),
    selectDimensionOption: (id, evt) =>
        dispatch(selectDimensionOption(id, evt.target.value)),
    toggleSelectedUnitOnly: (e, selectedUnitOnly) =>
        dispatch(toggleSelectedUnitOnly(selectedUnitOnly)),
    shareDataSetReportComment: comment =>
        dispatch(shareDataSetReportComment(comment)),
    setDataSetReportComment: comment => dispatch(setReportComment(comment)),
})

export const connectDataSetReport = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
