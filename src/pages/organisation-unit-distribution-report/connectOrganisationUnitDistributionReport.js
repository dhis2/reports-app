import { connect } from 'react-redux'
import { loadChart, loadTable } from '../../redux/actions/orgUnitDistReport'
import { loadGroupSetOptions } from '../../redux/actions/orgUnitGroupSets'
import { getLoading } from '../../redux/selectors/orgUnitDistReport/getLoading'
import { getIsActionEnabled } from '../../redux/selectors/orgUnitDistReport/getIsActionEnabled'
import getTransformedTableData from '../../redux/selectors/orgUnitDistReport/getTransformedTableData'
import getTransformedChartData from '../../redux/selectors/orgUnitDistReport/getTransformedChartData'

const mapStateToProps = state => ({
    shouldShowChart: state.orgUnitDistReport.shouldShowChart,
    loading: getLoading(state),
    reportContent: state.orgUnitDistReport.shouldShowChart
        ? getTransformedChartData(state)
        : getTransformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isActionEnabled: getIsActionEnabled(state),
    groupSetsReady: !!state.orgUnitGroupSets.collection.length,
})

const mapDispatchToProps = {
    loadChart,
    loadTable,
    loadGroupSetOptions,
}

export const connectOrganisationUnitDistributionReport = connect(
    mapStateToProps,
    mapDispatchToProps
)
