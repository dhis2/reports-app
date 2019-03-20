import { connect } from 'react-redux'
import isEmpty from 'lodash.isempty'

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
import { unsetReportData } from '../../redux/actions/reportData'

const mapStateToProps = state => ({
    ...state.standardReport,
    reportData: isEmpty(state.reportData.content)
        ? undefined
        : state.reportData.content,
    pager: state.pagination,
})

const mapDispatchToProps = dispatch => ({
    loadStandardReports: fetchReportTables =>
        dispatch(loadStandardReports(fetchReportTables)),
    addReportFormShow: report => dispatch(addReportFormShow(report)),
    createReport: report => dispatch(showReportParams(report)),
    editReport: report => dispatch(editReportFormShow(report)),
    deleteStandardReport: report => dispatch(deleteStandardReport(report)),
    sharingSettings: report => dispatch(sharingSettingsShow(report)),
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    requestDeleteStandardReport: report =>
        dispatch(requestDeleteStandardReport(report)),
    setSearch: term => dispatch(setSearch(term)),
    showReportData: reportData => dispatch(showReportData(reportData)),
    hideReportData: reportData => dispatch(hideReportData(reportData)),
    closeContextMenu: refreshList => dispatch(closeContextMenu(refreshList)),
    updateStandardReport: report => dispatch(sendStandardReport(report, true)),
    addStandardReport: report => dispatch(sendStandardReport(report, false)),
    closeReport: () => dispatch(unsetReportData()),
})

const connectStandardReport = StandardReport =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StandardReport)

export default connectStandardReport
