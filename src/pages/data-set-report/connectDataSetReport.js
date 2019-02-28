import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import {
    loadReportData,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
} from '../../redux/actions/dataSetReport'
import {
    setReportComment,
    unsetReportData,
} from '../../redux/actions/reportData'
import { isActionEnabled } from '../../redux/selectors/dataSetReport/isActionEnabled'
import getTranformedTableData from '../../redux/selectors/reportingRateSummary/getTranformedTableData.js'

const mapStateToProps = state => ({
    hasReport: !isEmpty(state.reportData.content),
    reportContent: getTranformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isReportLoading: state.reportData.loading,
    reportComment: state.reportData.comment,
    selectedUnitOnly: state.dataSetReport.selectedUnitOnly,
    selectedOrgUnit: state.organisationUnits.selected,
    selectedPeriod: state.reportPeriod.selectedPeriod,
    isActionEnabled: isActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    loadReportData: () => dispatch(loadReportData()),
    showDataSetReportForm: () => dispatch(unsetReportData()),
    selectDataSet: e => dispatch(selectDataSet(e.target.value)),
    toggleSelectedUnitOnly: (e, selectedUnitOnly) =>
        dispatch(toggleSelectedUnitOnly(selectedUnitOnly)),
    shareDataSetReportComment: comment =>
        dispatch(shareDataSetReportComment(comment)),
    setDataSetReportComment: comment => dispatch(setReportComment(comment)),
})

export const connectDataSetReport = component =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(component)
