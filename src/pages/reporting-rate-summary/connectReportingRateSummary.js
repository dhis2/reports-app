import { connect } from 'react-redux'
import {
    showForm,
    loadHtmlReport,
} from '../../redux/actions/reportingRateSummary'
import { exportReportToXls } from '../../redux/actions/htmlReport'

const mapStateToProps = state => ({
    loading: state.htmlReport.loading,
    showForm: state.reportingRateSummary.showForm,
    reportHtml: state.htmlReport.content,
    selectedDataSet: state.dataSet.selected,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    selectedOrgUnit: state.organisationUnits,
})

const mapDispatchToProps = dispatch => ({
    setShowForm: () => dispatch(showForm()),
    loadHtmlReport: () => dispatch(loadHtmlReport()),
    exportReportToXls: () =>
        dispatch(
            exportReportToXls(
                document.querySelectorAll('#report-container table')
            )
        ),
})

export const connectReportingRateSummary = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
