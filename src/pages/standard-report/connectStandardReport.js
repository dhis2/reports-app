import { connect } from 'react-redux';
import { updateFeedbackState } from '../../actions/feedback';
import {
    loadStandardReports,
    createReportShow,
    addReportFormShow,
    editReportFormShow,
    sharingSettingsShow,
    goToNextPage,
    goToPrevPage,
    requestDeleteStandardReport,
    setSearch,
    showHtmlReport,
    hideHtmlReport,
    closeContextMenu,
} from '../../actions/standardReport';

const mapStateToProps = state => ({
    showSnackbar: state.feedback.showSnackbar,
    snackbarConf: state.feedback.snackbarConf,
    ...state.standardReport,
});

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
    loadStandardReports: d2 => () => dispatch(loadStandardReports(d2)),
    addReportFormShow: report => dispatch(addReportFormShow(report)),
    createReport: report => dispatch(createReportShow(report)),
    editReport: report => dispatch(editReportFormShow(report)),
    sharingSettings: report => dispatch(sharingSettingsShow(report)),
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    requestDeleteStandardReport: report => dispatch(requestDeleteStandardReport(report)),
    setSearch: term => dispatch(setSearch(term)),
    showHtmlReport: htmlReport => dispatch(showHtmlReport(htmlReport)),
    hideHtmlReport: htmlReport => dispatch(hideHtmlReport(htmlReport)),
    closeContextMenu: refreshList => dispatch(closeContextMenu(refreshList)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...({
        ...dispatchProps,
        loadStandardReports: dispatchProps.loadStandardReports(ownProps.d2),
    }),
});

const connectStandardReport = StandardReport => connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(StandardReport);

export default connectStandardReport;
