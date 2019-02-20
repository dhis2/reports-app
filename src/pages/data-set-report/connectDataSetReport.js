import { connect } from 'react-redux'
import {
    loadHtmlReport,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
} from '../../redux/actions/dataSetReport'
import { selectDimensionOption } from '../../redux/actions/dataSetDimensions'
import {
    exportReportToXls,
    setReportComment,
    unsetHtmlReport,
} from '../../redux/actions/htmlReport'

const mapStateToProps = ({
    dataSet,
    dataSetDimensions,
    dataSetReport,
    organisationUnits,
    reportPeriod,
    htmlReport,
}) => ({
    reportHtml: htmlReport.content,
    reportComment: htmlReport.comment,
    selectedDataSet: dataSet.selected,
    selectedUnitOnly: dataSetReport.selectedUnitOnly,
    selectedOrgUnit: organisationUnits.selected,
    selectedPeriod: reportPeriod.selectedPeriod,
    showOptions: dataSetReport.showOptions,
})

const mapDispatchToProps = dispatch => ({
    exportReportToXls: () =>
        dispatch(
            exportReportToXls(
                document.querySelectorAll('#report-container table')
            )
        ),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
    showDataSetReportForm: () => dispatch(unsetHtmlReport()),
    selectDataSet: e => dispatch(selectDataSet(e.target.value)),
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
