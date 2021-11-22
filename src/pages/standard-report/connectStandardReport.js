import isEmpty from 'lodash.isempty'
import { connect } from 'react-redux'
import {
    addReportFormShow,
    closeContextMenu,
    deleteStandardReport,
    editReportFormShow,
    goToNextPage,
    goToPrevPage,
    hideReportData,
    loadStandardReports,
    requestDeleteStandardReport,
    sendStandardReport,
    setSearch,
    sharingSettingsShow,
    showReportData,
    showReportParams,
} from '../../redux/actions/standardReport'
// import { unsetReportData } from '../../redux/actions/reportData'

const mapStateToProps = (state) => ({
    ...state.standardReport,
    reportData: isEmpty(state.reportData.content)
        ? ''
        : state.reportData.content,
    pager: state.pagination,
})

const mapDispatchToProps = (dispatch) => ({
    addReportFormShow: (report) => dispatch(addReportFormShow(report)),
    addStandardReport: (report) => dispatch(sendStandardReport(report, false)),
    closeContextMenu: (refreshList) => dispatch(closeContextMenu(refreshList)),
    createReport: (report) => dispatch(showReportParams(report)),
    deleteStandardReport: (report) => dispatch(deleteStandardReport(report)),
    editReport: (report) => dispatch(editReportFormShow(report)),
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    hideReportData: (reportData) => dispatch(hideReportData(reportData)),
    loadStandardReports: () => dispatch(loadStandardReports()),
    requestDeleteStandardReport: (report) =>
        dispatch(requestDeleteStandardReport(report)),
    setSearch: (event) => dispatch(setSearch(event.target.value)),
    sharingSettings: (report) => dispatch(sharingSettingsShow(report)),
    showReportData: (reportData) => dispatch(showReportData(reportData)),
    updateStandardReport: (report) =>
        dispatch(sendStandardReport(report, true)),
})

const connectStandardReport = connect(mapStateToProps, mapDispatchToProps)

export default connectStandardReport
