import { connect } from 'react-redux'
import { loadChart, loadTable } from '../../redux/actions/orgUnitDistReport'
import { loadGroupSetOptions } from '../../redux/actions/orgUnitGroupSets'
import { getIsActionEnabled } from '../../redux/selectors/orgUnitDistReport/getIsActionEnabled'
import getTransformedChartData from '../../redux/selectors/orgUnitDistReport/getTransformedChartData'
import getTransformedTableData from '../../redux/selectors/orgUnitDistReport/getTransformedTableData'

const mapStateToProps = (state) => ({
    shouldShowChart: state.orgUnitDistReport.shouldShowChart,
    loading: state.reportData.loading,
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
