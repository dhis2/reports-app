/* React */
import React from 'react';
import PropTypes from 'prop-types';
/* material ui */
import { Dialog } from 'material-ui';
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
import AddNewStdReport from './add-new-report/AddNewStdReport';
import CreateStdReport from './create-report/CreateStdReport';
import EditStdReport from './edit-report/EditStdReport';
/* app config */
import { CONTEXT_MENU_ACTION, CONTEXT_MENU_ICONS, REPORTS_ENDPOINT } from './standard.report.conf';
/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue, INITIAL_PAGER } from '../../helpers/pagination';
/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

class StandardReport extends Page {
    constructor(props) {
        super(props);

        this.state = {
            pager: INITIAL_PAGER,
            reports: [],
            selectedReport: { id: '', displayName: '' },
            selectedAction: null,
            search: '',
            open: false,
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
        this.showDetails = this.showDetails.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadData(INITIAL_PAGER);
    }

    loadData(pager, search) {
        const api = this.props.d2.Api.getApi();
        let url = `${REPORTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}`;
        this.setState({ search });
        if (search && /\S/.test(search)) {
            url = `${url}&filter=displayName:ilike:${search}`;
        }
        if (api) {
            api.get(url).then((response) => {
                if (response) {
                    this.setState(response);
                }
            }).catch(() => {
                // TODO:
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
        this.loadData(pager);
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadData(pager);
    }

    /* Search */
    search(event) {
        if (this.state.search !== event.target.value) {
            this.loadData(INITIAL_PAGER, event.target.value);
        }
    }

    /* Add new Report */

    // TODO: implement
    addNewReport() {
        this.setState({ loading: true, open: true });
        // console.log(this.d2, 'Add new report!');
    }

    handleClose() {
        this.setState({ open: false });
    }

    /* Context Menu */
    createReport(...args) {
        this.setState({ open: true, selectedReport: args, selectedAction: CONTEXT_MENU_ACTION.CREATE });
    }

    editReport(...args) {
        this.setState({ open: true, selectedReport: args, selectedAction: CONTEXT_MENU_ACTION.EDIT });
    }

    sharingSettings(args) {
        this.setState({
            open: true,
            selectedReport: args,
            selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
        });
    }

    delete(...args) {
        this.setState({
            open: true,
            selectedReport: args,
            selectedAction: CONTEXT_MENU_ACTION.DELETE,
        });
    }

    showDetails(...args) {
        this.setState({
            open: true,
            selectedReport: args,
            selectedAction: CONTEXT_MENU_ACTION.SHOW_DETAILS,
        });
    }

    // TODO: Check Show Details
    getActionComponent() {
        let dialogContent;

        const actions = [
            <Button
                style={appStyles.dialogBtn}
                onClick={this.handleClose}
            >
                {i18n.t(i18nKeys.buttons.cancel)}
            </Button>,
            <Button
                raised
                color={'primary'}
                style={appStyles.dialogBtn}
                onClick={this.handleClose}
            >
                {i18n.t(i18nKeys.buttons.save)}
            </Button>,
        ];

        switch (this.state.selectedAction) {
        case CONTEXT_MENU_ACTION.CREATE:
            dialogContent = <CreateStdReport />;
            break;
        case CONTEXT_MENU_ACTION.SHARING_SETTINGS:
            return (
                <SharingDialog
                    open={this.state.open}
                    id={this.state.selectedReport.id}
                    type={'report'}
                    onRequestClose={this.handleClose}
                    d2={this.props.d2}
                />
            );
        case CONTEXT_MENU_ACTION.DELETE:
            dialogContent = (<div>Are you Sure?</div>);
            break;
        case CONTEXT_MENU_ACTION.EDIT:
            dialogContent = <EditStdReport />;
            break;
        default:
            dialogContent = <AddNewStdReport />;
            break;
        }

        return (
            <Dialog
                title={i18n.t(i18nKeys.standardReport.addNewReport.title)}
                actions={actions}
                modal={Boolean(true)}
                open={this.state.open}
            >
                {dialogContent}
            </Dialog>
        );
    }

    render() {
        // TODO: Check permissions
        const contextMenuOptions = {
            createReport: this.createReport,
            editReport: this.editReport,
            sharingSettings: this.sharingSettings,
            delete: this.delete,
            showDetails: this.showDetails,
        };

        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.standardReport.homeLabel) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <div id={'search-box-id'} style={styles.searchContainer}>
                    <TextField
                        value={this.state.search || ''}
                        type="search"
                        hintText={i18n.t(i18nKeys.standardReport.search)}
                        onBlur={this.search}
                    />
                </div>
                <Table
                    columns={['displayName']}
                    rows={this.state.reports}
                    contextMenuActions={contextMenuOptions}
                    contextMenuIcons={CONTEXT_MENU_ICONS}
                />
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
        );
    }
}

StandardReport.childContextTypes = {
    d2: PropTypes.object,
};

export default StandardReport;
