import { connect } from 'react-redux'
import { loadReportData } from '../../redux/actions/reportingRateSummary'
import { getIsActionEnabled } from '../../redux/selectors/reportingRateSummary/getIsActionEnabled'
import getTransformedTableData from '../../redux/selectors/reportingRateSummary/getTransformedTableData.js'

const mapStateToProps = state => ({
    reportContent: getTransformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isReportLoading: state.reportData.loading,
    isActionEnabled: getIsActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    loadReportData: () => dispatch(loadReportData()),
})

export const connectReportingRateSummary = connect(
    mapStateToProps,
    mapDispatchToProps
)
