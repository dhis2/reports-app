import { connect } from 'react-redux'
import {
    loadReportData,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
} from '../../redux/actions/dataSetReport'
import {
    exportReportToXls,
    setReportComment,
    unsetReportData,
} from '../../redux/actions/reportData'
import { isActionEnabled } from '../../redux/selectors/dataSetReport/isActionEnabled'

const mapStateToProps = state => ({
    reportHtml: state.reportData.content,
    reportComment: state.reportData.comment,
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
    loadReportData: () => dispatch(loadReportData()),
    showDataSetReportForm: () => dispatch(unsetReportData()),
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
