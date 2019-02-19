import { connect } from 'react-redux'
import {
    selectCriteria,
    loadHtmlReport,
} from '../../redux/actions/reportingRateSummary'
import {
    exportReportToXls,
    unsetHtmlReport,
} from '../../redux/actions/htmlReport'

const mapStateToProps = state => ({
    reportHtml: state.htmlReport.content,
    criteriaOptions: state.reportingRateSummary.criteriaOptions,
    selectedDataSet: state.dataSet.selected,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    selectedCriteria: state.reportingRateSummary.selectedCriteria,
    selectedOrgUnit: state.organisationUnits,
})

const mapDispatchToProps = dispatch => ({
    unsetHtmlReport: () => dispatch(unsetHtmlReport()),
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
