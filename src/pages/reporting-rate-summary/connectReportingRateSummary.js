import { connect } from 'react-redux'
import { loadReportData } from '../../redux/actions/reportingRateSummary'
import { isActionEnabled } from '../../redux/selectors/reportingRateSummary/isActionEnabled'
import parseTableData from '../../redux/selectors/reportingRateSummary/parseTableData'

const mapStateToProps = state => ({
    reportContent: parseTableData(state),
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
