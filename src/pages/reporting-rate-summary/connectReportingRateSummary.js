import { connect } from 'react-redux'
import { loadReportData } from '../../redux/actions/reportingRateSummary'
import {
    exportReportToXls,
    unsetReportData,
} from '../../redux/actions/reportData'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'
import parseTableData from '../../redux/selectors/reportingRateSummary/parseTableData'

const mapStateToProps = state => ({
    reportHtml: parseTableData(state),
    selectedOrgUnit: state.organisationUnits,
    isActionEnabled: isActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    unsetReportData: () => dispatch(unsetReportData()),
    loadReportData: () => dispatch(loadReportData()),
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
