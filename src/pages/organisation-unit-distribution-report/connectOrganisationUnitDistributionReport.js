import { connect } from 'react-redux'
import { loadChart, loadTable } from '../../redux/actions/orgUnitDistReport.js'
import { loadGroupSetOptions } from '../../redux/actions/orgUnitGroupSets.js'
import { getIsActionEnabled } from '../../redux/selectors/orgUnitDistReport/getIsActionEnabled.js'
import getTransformedChartData from '../../redux/selectors/orgUnitDistReport/getTransformedChartData.js'
import getTransformedTableData from '../../redux/selectors/orgUnitDistReport/getTransformedTableData.js'

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
