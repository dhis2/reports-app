import { connect } from 'react-redux'
import { loadReportData } from '../../redux/actions/reportingRateSummary'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'
import getTransformedTableData from '../../redux/selectors/reportingRateSummary/getTransformedTableData.js'

const mapStateToProps = state => ({
    reportContent: getTransformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isReportLoading: state.reportData.loading,
    isActionEnabled: isActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    loadReportData: () => dispatch(loadReportData()),
})

export const connectReportingRateSummary = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
