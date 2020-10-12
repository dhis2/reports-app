import { connect } from 'react-redux'
import {
    loadReportData,
    selectDataSet,
    toggleSelectedUnitOnly,
    shareDataSetReportComment,
} from '../../redux/actions/dataSetReport'
import { setReportComment } from '../../redux/actions/reportData'
import { getIsActionEnabled } from '../../redux/selectors/dataSetReport/getIsActionEnabled'
import getTransformedTableData from '../../redux/selectors/dataSetReport/getTransformedTableData'
import { isHtmlReport } from '../../utils/dataSetReport/isHtmlReport'
import {
    loadNoOfSignatures,
    selectNoOfSignatures,
} from '../../redux/actions/dataSetNoOfSignatuesReport'

const mapStateToProps = state => ({
    isHtmlReport: isHtmlReport(state.reportData.content),
    reportContent: getTransformedTableData(state),
    fileUrls: state.reportData.content.fileUrls || [],
    isReportLoading: state.reportData.loading,
    reportComment: state.reportData.comment,
    selectedUnitOnly: state.dataSetReport.selectedUnitOnly,
    isActionEnabled: getIsActionEnabled(state),
})

const mapDispatchToProps = dispatch => ({
    loadReportData: () => dispatch(loadReportData()),
    selectDataSet: e => dispatch(selectDataSet(e.target.value)),
    toggleSelectedUnitOnly: (e, selectedUnitOnly) =>
        dispatch(toggleSelectedUnitOnly(selectedUnitOnly)),
    shareDataSetReportComment: comment =>
        dispatch(shareDataSetReportComment(comment)),
    setDataSetReportComment: comment => dispatch(setReportComment(comment)),
    loadNoOfSignatures: () => dispatch(loadNoOfSignatures()),
    selectNoOfSignatures: e => dispatch(selectNoOfSignatures(e.target.value)),
})

export const connectDataSetReport = connect(
    mapStateToProps,
    mapDispatchToProps
)
