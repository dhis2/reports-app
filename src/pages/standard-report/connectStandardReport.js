import { connect } from 'react-redux'
import {
    loadStandardReports,
    createReportShow,
    addReportFormShow,
    editReportFormShow,
    deleteStandardReport,
    sharingSettingsShow,
    goToNextPage,
    goToPrevPage,
    requestDeleteStandardReport,
    setSearch,
    showReportData,
    hideReportData,
    closeContextMenu,
} from '../../redux/actions/standardReport'

const mapStateToProps = state => ({
    ...state.standardReport,
    pager: state.pagination,
})

const mapDispatchToProps = dispatch => ({
    loadStandardReports: () => dispatch(loadStandardReports()),
    addReportFormShow: report => dispatch(addReportFormShow(report)),
    createReport: report => dispatch(createReportShow(report)),
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
})

const connectStandardReport = StandardReport =>
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StandardReport)

export default connectStandardReport
