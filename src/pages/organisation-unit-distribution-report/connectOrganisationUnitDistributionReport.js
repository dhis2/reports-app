import { connect } from 'react-redux'
import {
    loadingChartImageUrlStart,
    loadingChartImageUrlSuccessWithFeedback,
    loadingChartImageUrlErrorWithFeedback,
} from '../../redux/actions/orgUnitDistReport'
import { loadGroupSetOptions } from '../../redux/actions/orgUnitGroupSets'
import { loadReport } from '../../redux/actions/orgUnitDistReport'
import { getChartImageUrl } from '../../redux/selectors/orgUnitDistReport/getChartImageUrl'
import { getLoading } from '../../redux/selectors/orgUnitDistReport/getLoading'
import { getIsActionEnabled } from '../../redux/selectors/orgUnitDistReport/getIsActionEnabled'
import getTranformedTableData from '../../redux/selectors/reportingRateSummary/getTranformedTableData.js'

const mapStateToProps = state => ({
    imageUrl: getChartImageUrl(state),
    displayImage: state.orgUnitDistReport.displayImage,
    loading: getLoading(state),
    reportContent: getTranformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isActionEnabled: getIsActionEnabled(state),
    groupSetsReady: !!state.orgUnitGroupSets.collection.length,
})

const mapDispatchToProps = {
    loadReport,
    loadGroupSetOptions,
    loadChart: loadingChartImageUrlStart,
    handleChartLoaded: loadingChartImageUrlSuccessWithFeedback,
    handleChartLoadingError: loadingChartImageUrlErrorWithFeedback,
}

export const connectOrganisationUnitDistributionReport = connect(
    mapStateToProps,
    mapDispatchToProps
)
