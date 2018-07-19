/* React */
import React from 'react';
import PropTypes from 'prop-types';

/* material ui */
import { Paper } from 'material-ui';

/* d2-ui */
import Table from '@dhis2/d2-ui-table';
import SharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { Button, Pagination, SvgIcon, TextField } from '@dhis2/d2-ui-core';

/* d2-ui styles */
import '@dhis2/d2-ui-core/build/css/Table.css';
import '@dhis2/d2-ui-core/build/css/Pagination.css';

/* styles */
import styles from './StandardReport.style';
import appStyles from '../../styles';

/* app components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import AddEditStdReport from './add-edit-report/AddEditStdReport';
import CreateStdReport from './create-report/CreateStdReport';

/* app config */
import {
    ADD_NEW_REPORT_ACTION, CONTEXT_MENU_ACTION, CONTEXT_MENU_ICONS, REPORTS_ENDPOINT } from './standard.report.conf';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue, INITIAL_PAGER } from '../../helpers/pagination';
import { ACTION_MESSAGE, SUCCESS } from '../../helpers/feedbackSnackBarTypes';


/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

class StandardReport extends Page {
    constructor(props) {
        super(props);

        this.state = {
            pager: INITIAL_PAGER,
            reports: [],
            selectedReport: null,
            selectedAction: null,
            search: '',
            open: false,
            showHtmlReport: false,
        };

        this.search = this.search.bind(this);
        this.addNewReport = this.addNewReport.bind(this);

        /* Pagination */
        this.hasNextPage = this.hasNextPage.bind(this);
        this.hasPreviousPage = this.hasPreviousPage.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);

        /* Context Menu */
        this.createReport = this.createReport.bind(this);
        this.editReport = this.editReport.bind(this);
        this.sharingSettings = this.sharingSettings.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDisplayHtmlReport = this.handleDisplayHtmlReport.bind(this);
    }

    getChildContext() {
        return { d2: this.props.d2 };
    }

    // TODO: Fix urls/paths to scripts or find a better way to do this
    componentDidMount() {
        super.componentDidMount();

        const jqueryScript = document.createElement('script');
        jqueryScript.type = 'text/javascript';
        jqueryScript.src = 'http://localhost:8080/dhis-web-commons/javascripts/jQuery/jquery.min.js';
        jqueryScript.onload = () => {
            this.loadDHIS2Script();
        };
        document.head.appendChild(jqueryScript);
        this.loadData(INITIAL_PAGER);
    }

    loadDHIS2Script = () => {
        const dhis2Script = document.createElement('script');
        dhis2Script.type = 'text/javascript';
        dhis2Script.src = 'http://localhost:8080/dhis-web-commons/javascripts/dhis2/dhis2.util.js';
        document.head.appendChild(dhis2Script);
    };

    loadData(pager, search) {
        const api = this.props.d2.Api.getApi();
        let url = `${REPORTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}` +
        '&fields=displayName,type,id,reportTable[id,displayName]';
        this.setState({ search });
        if (search) {
            url = `${url}&filter=displayName:ilike:${search}`;
        }
        if (api) {
            this.props.updateAppState({ pageState: { loading: true } });
            api.get(url).then((response) => {
                if (response && this.isPageMounted()) {
                    this.props.updateAppState((this.state.deleteInProgress) ? {
                        pageState: { loading: false },
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: i18n.t(i18nKeys.messages.reportDeleted),
                        },
                    } : {
                        showSnackbar: false,
                        pageState: { loading: false },
                    });
                    this.setState(response);
                }
            }).catch(() => {
                // TODO:
            }).finally(() => {
                this.state.deleteInProgress = false;
            });
        }
    }

    /* Pagination */
    hasNextPage() {
        return this.state.pager.page < this.state.pager.pageCount;
    }

    hasPreviousPage() {
        return this.state.pager.page > 1;
    }

    onNextPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page += 1;
        this.loadData(pager, this.state.search);
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadData(pager, this.state.search);
    }

    /* Search */
    search(event) {
        // ...and not empty search
        if (this.state.search !== event.target.value && /\S/.test(event.target.value)) {
            this.loadData(INITIAL_PAGER, event.target.value);
        } else if (this.state.search !== event.target.value) {
            this.loadData(INITIAL_PAGER);
        }
    }

    /* Add new Report */
    addNewReport() {
        this.setState({ loading: true, open: true, selectedAction: ADD_NEW_REPORT_ACTION });
    }

    handleClose(refreshList) {
        this.setState({ open: false, selectedReport: null });
        if (refreshList === true) {
            this.loadData(INITIAL_PAGER);
        }
    }

    handleDisplayHtmlReport(html) {
        const domfrag = document.createRange().createContextualFragment(html);
        document.getElementById('html-report-id').appendChild(domfrag);
        this.setState({ showHtmlReport: true });
        this.handleClose();
    }

    goBack = () => { this.setState({ showHtmlReport: false }); };

    /* Context Menu */
    createReport(args) {
        this.setState({ open: true, selectedReport: args, selectedAction: CONTEXT_MENU_ACTION.CREATE });
    }

    editReport(args) {
        this.setState({ open: true, selectedReport: args, selectedAction: CONTEXT_MENU_ACTION.EDIT });
    }

    sharingSettings(args) {
        this.setState({ open: true, selectedReport: args, selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS });
    }

    delete(args) {
        this.props.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ACTION_MESSAGE,
                message: args.displayName,
                action: i18n.t(i18nKeys.standardReport.confirmDelete),
                onActionClick: () => {
                    const api = this.props.d2.Api.getApi();
                    const url = `${REPORTS_ENDPOINT}/${args.id}`;
                    this.state.deleteInProgress = true;
                    this.props.updateAppState({
                        showSnackbar: false,
                        pageState: { loading: true },
                    });
                    api.delete(url).then((response) => {
                        if (response && this.isPageMounted()) {
                            this.loadData(INITIAL_PAGER, this.state.search);
                        }
                    }).catch(() => {
                        // TODO:
                    });
                },
            },
        });
    }

    getCreateStdReportComponent() {
        return this.state.selectedReport ? (
            <CreateStdReport
                selectedReport={this.state.selectedReport}
                open={this.state.open}
                onRequestClose={this.handleClose}
                onGetHtmlReport={this.handleDisplayHtmlReport}
                d2={this.props.d2}
            />
        ) : '';
    }

    getSharingDialog() {
        return this.state.selectedReport ? (
            <SharingDialog
                open={this.state.open}
                id={this.state.selectedReport.id}
                type={'report'}
                onRequestClose={this.handleClose}
                d2={this.props.d2}
            />
        ) : '';
    }

    getEditComponent() {
        return (
            <AddEditStdReport
                selectedReport={this.state.selectedReport}
                open={this.state.open}
                onRequestClose={this.handleClose}
                d2={this.props.d2}
                updateAppState={this.props.updateAppState}
            />
        );
    }

    getAddComponent() {
        return (
            <AddEditStdReport
                open={this.state.open}
                onRequestClose={this.handleClose}
                d2={this.props.d2}
                updateAppState={this.props.updateAppState}
            />
        );
    }

    getActionComponent() {
        switch (this.state.selectedAction) {
        case CONTEXT_MENU_ACTION.CREATE:
            return this.getCreateStdReportComponent();
        case CONTEXT_MENU_ACTION.SHARING_SETTINGS:
            return this.getSharingDialog();
        case CONTEXT_MENU_ACTION.EDIT:
            return this.getEditComponent();
        case ADD_NEW_REPORT_ACTION:
            return this.getAddComponent();
        default:
            return '';
        }
    }

    render() {
        // TODO: Check permissions
        const contextMenuOptions = {
            createReport: this.createReport,
            editReport: this.editReport,
            sharingSettings: this.sharingSettings,
            delete: this.delete,
        };

        return (
            <div>
                <h1>
                    { this.state.showHtmlReport &&
                    <span
                        id="back-button"
                        style={styles.backButton}
                        className="material-icons"
                        role="button"
                        tabIndex="0"
                        onClick={this.goBack}
                    >
                        arrow_back
                    </span>
                    }
                    { i18n.t(i18nKeys.standardReport.homeLabel) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <div style={{ display: this.state.showHtmlReport ? 'none' : 'block' }}>
                    <Pagination
                        total={this.state.pager.total}
                        hasNextPage={this.hasNextPage}
                        hasPreviousPage={this.hasPreviousPage}
                        onNextPageClick={this.onNextPageClick}
                        onPreviousPageClick={this.onPreviousPageClick}
                        currentlyShown={calculatePageValue(this.state.pager)}
                    />
                    <div id={'search-box-id'} style={styles.searchContainer}>
                        <TextField
                            value={this.state.search || ''}
                            type="search"
                            hintText={i18n.t(i18nKeys.standardReport.search)}
                            onBlur={this.search}
                        />
                    </div>
                    <Table
                        columns={['displayName', 'reportTable', 'id']}
                        rows={this.state.reports}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                    />
                    <p style={
                        {
                            textAlign: 'center',
                            ...(this.state.reports.length > 0 ? { display: 'none' } : ''),
                        }
                    }
                    >
                        {i18n.t(i18nKeys.messages.noResultsFound)}
                    </p>
                    <div id={'footer-pagination-id'} style={appStyles.marginForAddButton}>
                        <Pagination
                            total={this.state.pager.total}
                            hasNextPage={this.hasNextPage}
                            hasPreviousPage={this.hasPreviousPage}
                            onNextPageClick={this.onNextPageClick}
                            onPreviousPageClick={this.onPreviousPageClick}
                            currentlyShown={calculatePageValue(this.state.pager)}
                        />
                    </div>
                    <Button fab onClick={this.addNewReport} style={appStyles.addButton}>
                        <SvgIcon icon={'Add'} />
                    </Button>
                    { this.getActionComponent() }
                </div>
                <Paper
                    style={{
                        display: this.state.showHtmlReport ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div id={'html-report-id'} />
                </Paper>
            </div>
        );
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
};

export default StandardReport;
