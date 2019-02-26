import { connect } from 'react-redux'
import { loadReportData } from '../../redux/actions/reportingRateSummary'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'
import getTranformedTableData from '../../redux/selectors/reportingRateSummary/getTranformedTableData.js'

const mapStateToProps = state => ({
    reportContent: getTranformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isReportLoading: state.reportData.loading,
    isActionEnabled: isActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    loadReportData: () => dispatch(loadReportData()),
})

const areStatesEqual = (next, prev) =>
    isActionEnabled(next) === isActionEnabled(prev) &&
    next.organisationUnits === prev.organisationUnits &&
    next.reportData === prev.reportData

export const connectReportingRateSummary = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps,
        null,
        { areStatesEqual }
    )(component)
