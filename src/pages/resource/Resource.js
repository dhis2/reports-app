/* React */
import React from 'react';
import PropTypes from 'prop-types';

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

/* styles */
import styles from './Resource.style';
import appStyles from '../../styles';

/* app components */
import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { ConnectedAddEditResource } from './add-edit-resource/AddEditResource';
import { ACTION_MESSAGE, SUCCESS, LOADING } from '../../helpers/feedbackSnackBarTypes';

/* utils */
import { getDocsUrl } from '../../helpers/docs';
import { calculatePageValue, INITIAL_PAGER } from '../../helpers/pagination';

/* app config */
import { DOCUMENTS_ENDPOINT, ADD_NEW_RESOURCE_ACTION, CONTEXT_MENU_ACTION, CONTEXT_MENU_ICONS } from './resource.conf';
import { DEBOUNCE_DELAY } from '../sections.conf';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

export default class Resource extends Page {
    static propTypes = {
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.object,
    };

    static defaultProps = {
        showSnackbar: false,
        snackbarConf: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            pager: INITIAL_PAGER,
            documents: [],
            search: '',
            open: false,
            timeoutId: null,
            loading: false,
        };

        this.search = this.search.bind(this);
        this.debounceSearch = this.debounceSearch.bind(this);
        this.addNewResource = this.addNewResource.bind(this);

        /* Pagination */
        this.hasNextPage = this.hasNextPage.bind(this);
        this.hasPreviousPage = this.hasPreviousPage.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);

        /* Context Menu */
        this.viewResource = this.viewResource.bind(this);
        this.editResource = this.editResource.bind(this);
        this.sharingSettings = this.sharingSettings.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    getChildContext() {
        return { d2: this.props.d2 };
    }

    componentDidMount() {
        super.componentDidMount();
        this.loadDocuments(INITIAL_PAGER);
    }

    componentWillUnmount() {
        if (this.state.timeoutId) {
            clearTimeout(this.state.timeoutId);
        }
    }

    loadDocuments(pager, search) {
        const api = this.props.d2.Api.getApi();
        let url = `${DOCUMENTS_ENDPOINT}?page=${pager.page}&pageSize=${pager.pageSize}` +
        '&fields=displayName,id,url,external';
        this.setState({ search });
        if (search) {
            url = `${url}&filter=displayName:ilike:${search}`;
        }
        if (api) {
            this.startLoading();
            api.get(url).then((response) => {
                if (response && this.isPageMounted()) {
                    if (this.state.deleteInProgress) {
                        this.props.updateFeedbackState(
                            true,
                            {
                                type: SUCCESS,
                                message: i18n.t(i18nKeys.messages.resourceDeleted),
                            },
                        );
                    } else {
                        this.stopLoading();
                    }
                    this.setState(response);
                }
            }).catch((error) => {
                this.handleError(error);
            }).finally(() => {
                this.state.deleteInProgress = false;
            });
        }
    }

    startLoading = () => {
        this.props.updateFeedbackState(true, { type: LOADING });
        this.setState({ loading: true });
    };

    stopLoading = () => {
        this.props.updateFeedbackState(false);
        this.setState({ loading: false });
    };

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
        this.loadDocuments(pager, this.state.search);
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadDocuments(pager, this.state.search);
    }

    /* Search */
    search(field, value) {
        // ...and not empty search
        if (this.state.search !== value && /\S/.test(value)) {
            this.loadDocuments(INITIAL_PAGER, value);
        } else if (this.state.search !== value) {
            this.loadDocuments(INITIAL_PAGER);
        }
    }

    debounceSearch(field, lastSearch) {
        if (this.state.timeoutId) {
            clearTimeout(this.state.timeoutId);
        }
        this.state.timeoutId = setTimeout(() => { this.search(field, lastSearch); }, DEBOUNCE_DELAY);
        this.setState({ lastSearch });
    }

    handleClose(refreshList) {
        this.setState({ open: false, selectedResource: null });
        if (refreshList === true) {
            this.loadDocuments(INITIAL_PAGER);
        }
    }

    handleError(error) {
        this.manageError(error);
    }

    /* Add new Resource */
    addNewResource() {
        this.setState({ loading: true, open: true, selectedAction: ADD_NEW_RESOURCE_ACTION });
    }

    /* Context Menu Actions */
    viewResource(args) {
        this.setState({ open: true, selectedResource: args, selectedAction: CONTEXT_MENU_ACTION.VIEW });
    }

    sharingSettings(args) {
        this.setState({ open: true, selectedResource: args, selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS });
    }

    editResource(args) {
        this.setState({ open: true, selectedResource: args, selectedAction: CONTEXT_MENU_ACTION.EDIT });
    }

    delete(args) {
        this.props.updateFeedbackState(true, {
            type: ACTION_MESSAGE,
            message: args.displayName,
            action: i18n.t(i18nKeys.messages.confirmDelete),
            onActionClick: () => {
                const api = this.props.d2.Api.getApi();
                const url = `${DOCUMENTS_ENDPOINT}/${args.id}`;
                this.state.deleteInProgress = true;
                this.stopLoading();
                api.delete(url).then((response) => {
                    if (response && this.isPageMounted()) {
                        this.loadDocuments(INITIAL_PAGER, this.state.search);
                    }
                }).catch((error) => {
                    this.handleError(error);
                });
            },
        });
    }

    /* Context Menu "Components" */
    getAddResourceComponent() {
        return (
            <ConnectedAddEditResource
                d2={this.props.d2}
                open={this.state.open}
                onRequestClose={this.handleClose}
                onError={this.handleError}
            />
        );
    }

    getEditComponent() {
        return (
            <ConnectedAddEditResource
                selectedResource={this.state.selectedResource}
                open={this.state.open}
                onRequestClose={this.handleClose}
                d2={this.props.d2}
                onError={this.handleError}
            />
        );
    }

    getViewResourceComponent() {
        const api = this.props.d2.Api.getApi();
        const url = `${api.baseUrl}/${DOCUMENTS_ENDPOINT}/${this.state.selectedResource.id}/data`;
        window.open(url);
    }

    getSharingDialog() {
        return this.state.selectedResource && (
            <SharingDialog
                open={this.state.open}
                id={this.state.selectedResource.id}
                type={'document'}
                onRequestClose={this.handleClose}
                d2={this.props.d2}
            />
        );
    }

    getActionComponent() {
        switch (this.state.selectedAction) {
        case ADD_NEW_RESOURCE_ACTION:
            return this.getAddResourceComponent();
        case CONTEXT_MENU_ACTION.VIEW:
            return this.getViewResourceComponent();
        case CONTEXT_MENU_ACTION.SHARING_SETTINGS:
            return this.getSharingDialog();
        case CONTEXT_MENU_ACTION.EDIT:
            return this.getEditComponent();
        default:
            return '';
        }
    }

    render() {
        const contextMenuOptions = {
            viewResource: this.viewResource,
            sharingSettings: this.sharingSettings,
            editResource: this.editResource,
            delete: this.delete,
        };
        return (
            <div>
                <h1>
                    { i18n.t(i18nKeys.resource.homeLabel) }
                    <PageHelper
                        url={getDocsUrl(this.props.d2.system.version, this.props.sectionKey)}
                    />
                </h1>
                <div id="resource-content">
                    <Pagination
                        total={this.state.pager.total}
                        hasNextPage={this.hasNextPage}
                        hasPreviousPage={this.hasPreviousPage}
                        onNextPageClick={this.onNextPageClick}
                        onPreviousPageClick={this.onPreviousPageClick}
                        currentlyShown={calculatePageValue(this.state.pager)}
                    />
                    <div id={'search-box-id'} style={styles.searchContainer}>
                        <InputField
                            value={this.state.lastSearch || ''}
                            type="text"
                            hintText={i18n.t(i18nKeys.resource.search)}
                            // eslint-disable-next-line
                            onChange={value => this.debounceSearch('search', value)}
                        />
                    </div>
                    <Table
                        columns={['displayName']}
                        rows={this.state.documents}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                    />
                    <p
                        id={'no-resource-find-message-id'}
                        style={
                            {
                                textAlign: 'center',
                                ...(
                                    this.state.documents.length > 0 || this.state.loading ? { display: 'none' } : ''
                                ),
                            }
                        }
                    >
                        {i18n.t(i18nKeys.messages.noResultsFound)}
                    </p>
                    <div id={'footer-pagination-id'}>
                        <Pagination
                            total={this.state.pager.total}
                            hasNextPage={this.hasNextPage}
                            hasPreviousPage={this.hasPreviousPage}
                            onNextPageClick={this.onNextPageClick}
                            onPreviousPageClick={this.onPreviousPageClick}
                            currentlyShown={calculatePageValue(this.state.pager)}
                        />
                    </div>
                    <Button id={'add-resource-btn-id'} fab onClick={this.addNewResource} style={appStyles.addButton}>
                        <SvgIcon icon={'Add'} />
                    </Button>
                    { this.getActionComponent() }
                </div>
            </div>
        );
    }
}

Resource.childContextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    showSnackbar: state.feedback.showSnackbar,
    snackbarConf: { ...state.feedback.snackbarConf },
});

const mapDispatchToProps = dispatch => ({
    updateFeedbackState: updateFeedbackState(dispatch),
});

export const ConnectedResource = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Resource);
