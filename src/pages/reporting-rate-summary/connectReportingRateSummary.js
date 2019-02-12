import { connect } from 'react-redux'
import {
    showForm,
    selectCriteria,
    loadHtmlReport,
} from '../../redux/actions/reportingRateSummary'
import { exportReportToXls } from '../../redux/actions/htmlReport'

const mapStateToProps = state => ({
    loading: state.htmlReport.loading,
    showForm: state.reportingRateSummary.showForm,
    reportHtml: state.htmlReport.content,
    criteriaOptions: state.reportingRateSummary.criteriaOptions,
    selectedDataSet: state.dataSet.selected,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    selectedCriteria: state.reportingRateSummary.selectedCriteria,
    selectedOrgUnit: state.organisationUnits,
})

const mapDispatchToProps = dispatch => ({
    setShowForm: () => dispatch(showForm()),
    selectCriteria: event => dispatch(selectCriteria(event.target.value)),
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
