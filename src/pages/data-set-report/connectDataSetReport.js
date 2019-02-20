import { connect } from 'react-redux'
import {
    loadHtmlReport,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
} from '../../redux/actions/dataSetReport'
import {
    exportReportToXls,
    setReportComment,
    unsetHtmlReport,
} from '../../redux/actions/htmlReport'
import { isActionEnabled } from '../../redux/selectors/dataSetReport/isActionEnabled'

const mapStateToProps = state => ({
    reportHtml: state.htmlReport.content,
    reportComment: state.htmlReport.comment,
    selectedUnitOnly: state.dataSetReport.selectedUnitOnly,
    selectedOrgUnit: state.organisationUnits.selected,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    isActionEnabled: isActionEnabled(state),
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
