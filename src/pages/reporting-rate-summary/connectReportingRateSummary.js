import { connect } from 'react-redux'
import { loadHtmlReport } from '../../redux/actions/reportingRateSummary'
import {
    exportReportToXls,
    unsetHtmlReport,
} from '../../redux/actions/htmlReport'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'
import parseTableData from '../../redux/selectors/reportingRateSummary/parseTableData'

const mapStateToProps = state => ({
    reportHtml: parseTableData(state),
    selectedOrgUnit: state.organisationUnits,
    isActionEnabled: isActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    unsetHtmlReport: () => dispatch(unsetHtmlReport()),
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
