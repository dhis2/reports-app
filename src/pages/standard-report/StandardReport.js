/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material ui */
import { Paper } from 'material-ui';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { Button, Pagination, SvgIcon, InputField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* Redux */
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

/* styles */
import styles from './StandardReport.style';
import appStyles from '../../styles';

/* app components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { ConnectedAddEditStdReport } from './add-edit-report/AddEditStdReport';
import CreateStdReport from './create-report/CreateStdReport';
import HtmlReport from './HtmlReport';

/* app config */
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './standard.report.conf';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue } from '../../helpers/pagination';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* Pagination */
const hasNextPageCreator = (page, pageCount) => () =>
    page < pageCount;

const hasPreviousPageCreator = page => () =>
    page > 1;

/* Context Menu */
const displayNoResults = (reports, loading) => (
    reports.length > 0 || loading
        ? { display: 'none' }
        : ''
);

const showContextAction = (report, action) => {
    const access = report && report.access ? report.access : {};
    const actions = {
        [CONTEXT_MENU_ACTION.CREATE]: access.read,
        [CONTEXT_MENU_ACTION.EDIT]: access.update,
        [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: (access.manage || access.externalize),
        [CONTEXT_MENU_ACTION.DELETE]: access.delete,
    };
    return (actions[action] || false);
};

export default class StandardReport extends Page {
    static propTypes = {
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.object,
        pager: PropTypes.object.isRequired,
        reports: PropTypes.array.isRequired,
        selectedReport: PropTypes.object.isRequired,
        selectedAction: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
        open: PropTypes.bool.isRequired,
        htmlReport: PropTypes.string,
    };

    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.loadStandardReports();
    }

    render() {
        const { props } = this;
        const { pager } = props;
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount);
        const hasPreviousPage = hasPreviousPageCreator(pager.page);
        const contextMenuOptions = {
            [CONTEXT_MENU_ACTION.CREATE]: this.props.createReport,
            [CONTEXT_MENU_ACTION.EDIT]: this.props.editReport,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: this.props.sharingSettings,
            [CONTEXT_MENU_ACTION.DELETE]: this.props.delete,
        };

        return (
            <div>
                <Headline
                    showBackButton={!!props.htmlReport}
                    onGoBackClick={props.hideHtmlReport}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <div id="std-report-content" style={{ display: props.htmlReport ? 'none' : 'block' }} >
                    <StandardReportPagination
                        total={props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={props.goToNextPage}
                        onPreviousPageClick={props.goToPrevPage}
                        pager={props.pager}
                    />
                    <SearchBox
                        value={props.search}
                        onChange={props.setSearch}
                    />
                    <Table
                        columns={['displayName', 'reportTable', 'id']}
                        rows={props.reports}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                        isContextActionAllowed={showContextAction}
                    />
                    <NoResultsMessage styles={displayNoResults(props.reports, props.loading)} />
                    <StandardReportPagination
                        total={props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={props.goToNextPage}
                        onPreviousPageClick={props.goToPrevPage}
                        pager={props.pager}
                    />
                    <AddReportButton onClick={props.addReportFormShow} />
                    <ActionComponent
                        d2={props.d2}
                        open={props.open}
                        selectedAction={props.selectedAction}
                        selectedReport={props.selectedReport}
                        handleClose={props.closeContextMenu}
                        handleError={this.manageError}
                        handleDisplayHtmlReport={props.showHtmlReport}
                    />
                </div>
                <StyledHtmlReport htmlReport={props.htmlReport} />
            </div>
        );
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
};

const Headline = ({ showBackButton, onGoBackClick, systemVersion, sectionKey }) => (
    <h1>
        { showBackButton &&
            <span
                id="back-button"
                style={styles.backButton}
                className="material-icons"
                role="button"
                tabIndex="0"
                onClick={onGoBackClick}
            />
        }
        { i18n.t(i18nKeys.standardReport.homeLabel) }
        <PageHelper
            url={getDocsUrl(systemVersion, sectionKey)}
        />
    </h1>
);

Headline.propTypes = {
    showBackButton: PropTypes.bool.isRequired,
    onGoBackClick: PropTypes.func.isRequired,
    systemVersion: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
};

const SearchBox = ({ value, onChange }) => (
    <div id="search-box-id" style={styles.searchContainer}>
        <InputField
            id="search-std-report-id"
            value={value}
            type="text"
            hintText={i18n.t(i18nKeys.standardReport.search)}
            onChange={onChange}
        />
    </div>
);

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const NoResultsMessage = ({ additionalStyles }) => (
    <p
        id="no-std-report-find-message-id"
        style={{ textAlign: 'center', ...additionalStyles }}
    >
        {i18n.t(i18nKeys.messages.noResultsFound)}
    </p>
);

NoResultsMessage.propTypes = {
    additionalStyles: PropTypes.object,
};

NoResultsMessage.defaultProps = {
    additionalStyles: {},
};

const AddReportButton = ({ onClick }) => (
    <div id="add-std-report-btn-container-id">
        <Button
            fab
            id="add-std-report-btn-id"
            onClick={onClick}
            style={appStyles.addButton}
        >
            <SvgIcon icon="Add" />
        </Button>
    </div>
);

AddReportButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const StandardReportPagination = props => (
    <div id={'footer-pagination-id'} style={appStyles.marginForAddButton}>
        <Pagination
            total={props.total}
            hasNextPage={props.hasNextPage}
            hasPreviousPage={props.hasPreviousPage}
            onNextPageClick={props.onNextPageClick}
            onPreviousPageClick={props.onPreviousPageClick}
            currentlyShown={calculatePageValue(props.pager)}
        />
    </div>
);

StandardReportPagination.propTypes = {
    total: PropTypes.number.isRequired,
    hasNextPage: PropTypes.func.isRequired,
    hasPreviousPage: PropTypes.func.isRequired,
    onNextPageClick: PropTypes.func.isRequired,
    onPreviousPageClick: PropTypes.func.isRequired,
    pager: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageCount: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
};

const ActionComponent = ({
    d2,
    open,
    selectedAction,
    selectedReport,
    handleClose,
    handleError,
    handleDisplayHtmlReport,
}) => {
    if (selectedAction === CONTEXT_MENU_ACTION.CREATE) {
        return (
            <CreateStdReport
                d2={d2}
                open={open}
                selectedReport={selectedReport}
                onRequestClose={handleClose}
                onGetHtmlReport={handleDisplayHtmlReport}
                onError={handleError}
            />
        );
    }

    if (selectedAction === CONTEXT_MENU_ACTION.SHARING_SETTINGS) {
        return (
            <SharingDialog
                id={selectedReport.id}
                d2={d2}
                open={open}
                type="report"
                onRequestClose={handleClose}
            />
        );
    }

    if (selectedAction === CONTEXT_MENU_ACTION.EDIT) {
        return (
            <ConnectedAddEditStdReport
                selectedReport={selectedReport}
                open={open}
                onRequestClose={handleClose}
                d2={d2}
                onError={handleError}
            />
        );
    }

    if (selectedAction === ADD_NEW_REPORT_ACTION) {
        return (
            <ConnectedAddEditStdReport
                open={open}
                onRequestClose={handleClose}
                d2={d2}
                onError={handleError}
            />
        );
    }

    return null;
};

ActionComponent.propTypes = {
    d2: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedReport: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    handleDisplayHtmlReport: PropTypes.func.isRequired,
};

const StyledHtmlReport = ({ htmlReport }) => (
    <Paper
        style={{
            display: htmlReport ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <HtmlReport html={htmlReport} />
    </Paper>
);

StyledHtmlReport.propTypes = {
    htmlReport: PropTypes.string,
};

StyledHtmlReport.defaultProps = {
    htmlReport: null,
};

const mapStateToProps = state => ({
    showSnackbar: state.feedback.showSnackbar,
    snackbarConf: { ...state.feedback.snackbarConf },
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

export const ConnectedStandardReport = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
)(StandardReport);
