import { connect } from 'react-redux'
import {
    selectCriteria,
    loadHtmlReport,
} from '../../redux/actions/reportingRateSummary'
import {
    exportReportToXls,
    unsetHtmlReport,
} from '../../redux/actions/htmlReport'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'

const mapStateToProps = state => ({
    reportHtml: state.htmlReport.content,
    criteriaOptions: state.reportingRateSummary.criteriaOptions,
    selectedCriteria: state.reportingRateSummary.selectedCriteria,
    selectedOrgUnit: state.organisationUnits,
    isActionEnabled: isActionEnabled(state),
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
