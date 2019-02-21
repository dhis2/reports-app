import React from 'react'
import PropTypes from 'prop-types'
import Table from '@dhis2/d2-ui-table'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { Button, InputField, Pagination, SvgIcon } from '@dhis2/d2-ui-core'
import '@dhis2/d2-ui-core/build/css/Table.css'
import '@dhis2/d2-ui-core/build/css/Pagination.css'
import { connect } from 'react-redux'
import { updateFeedbackState } from '../redux/actions/feedback'
import styles from './resource/Resource.style'
import appStyles from '../utils/styles'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import PageHelper from '../components/PageHelper'
import { ConnectedAddEditResource } from './resource/add-edit-resource/AddEditResource'
import { ACTION_MESSAGE, SUCCESS, LOADING } from '../utils/feedbackTypes.js'
import { getDocsUrl } from '../utils/getDocsUrl'
import { defaultState as INITIAL_PAGER } from '../redux/reducers/pagination'
import {
    DOCUMENTS_ENDPOINT,
    ADD_NEW_RESOURCE_ACTION,
    CONTEXT_MENU_ACTION,
    CONTEXT_MENU_ICONS,
} from './resource/resource.conf'
import { DEBOUNCE_DELAY } from '../config/sections.conf'
import i18n from '../utils/i18n/locales'
import { i18nKeys } from '../utils/i18n/i18nKeys'

import {
    loadResources,
    goToNextPage,
    goToPrevPage,
    setSearch,
} from '../redux/actions/resource'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    calculatePageValue,
} from '../utils/pagination/helper'
import { SectionHeadline } from '../components/SectionHeadline'
import { NoResultsMessage } from '../components/NoResultsMessage'

export default class Resource extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            loading: false,
        }

        this.addNewResource = this.addNewResource.bind(this)

        /* Pagination */
        this.hasNextPage = this.hasNextPage.bind(this)
        this.hasPreviousPage = this.hasPreviousPage.bind(this)
        this.props.goToNextPage = this.props.goToNextPage.bind(this)
        this.props.goToPrevPage = this.props.goToPrevPage.bind(this)

        /* Context Menu */
        this.viewResource = this.viewResource.bind(this)
        this.editResource = this.editResource.bind(this)
        this.sharingSettings = this.sharingSettings.bind(this)
        this.delete = this.delete.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleError = this.handleError.bind(this)
    }

    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadResources()
    }

    /* Search */
    handleClose(refreshList) {
        this.setState({ open: false, selectedResource: null })
        if (refreshList === true) {
            this.loadDocuments(INITIAL_PAGER)
        }
    }

    handleError(error) {
        this.manageError(error)
    }

    /* Add new Resource */
    addNewResource() {
        this.setState({
            loading: true,
            open: true,
            selectedAction: ADD_NEW_RESOURCE_ACTION,
        })
    }

    /* Context Menu Actions */
    viewResource(args) {
        this.setState({
            open: true,
            selectedResource: args,
            selectedAction: CONTEXT_MENU_ACTION.VIEW,
        })
    }

    sharingSettings(args) {
        this.setState({
            open: true,
            selectedResource: args,
            selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
        })
    }

    editResource(args) {
        this.setState({
            open: true,
            selectedResource: args,
            selectedAction: CONTEXT_MENU_ACTION.EDIT,
        })
    }

    delete(args) {
        this.props.updateFeedbackState(true, {
            type: ACTION_MESSAGE,
            message: args.displayName,
            action: i18n.t(i18nKeys.messages.confirmDelete),
            onActionClick: () => {
                const api = this.props.d2.Api.getApi()
                const url = `${DOCUMENTS_ENDPOINT}/${args.id}`
                this.state.deleteInProgress = true
                this.startLoading()
                api.delete(url)
                    .then(response => {
                        if (response && this.isPageMounted()) {
                            this.props.loadResources()
                        }
                    })
                    .catch(error => {
                        this.handleError(error)
                    })
                    .finally(() => {
                        this.stopLoading()
                    })
            },
        })
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
        )
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
        )
    }

    getViewResourceComponent() {
        const api = this.props.d2.Api.getApi()
        const url = `${api.baseUrl}/${DOCUMENTS_ENDPOINT}/${
            this.state.selectedResource.id
        }/data`
        window.open(url)
    }

    getSharingDialog() {
        return (
            this.state.selectedResource && (
                <SharingDialog
                    open={this.state.open}
                    id={this.state.selectedResource.id}
                    type={'document'}
                    onRequestClose={this.handleClose}
                    d2={this.props.d2}
                />
            )
        )
    }

    getActionComponent() {
        switch (this.state.selectedAction) {
            case ADD_NEW_RESOURCE_ACTION:
                return this.getAddResourceComponent()
            case CONTEXT_MENU_ACTION.VIEW:
                return this.getViewResourceComponent()
            case CONTEXT_MENU_ACTION.SHARING_SETTINGS:
                return this.getSharingDialog()
            case CONTEXT_MENU_ACTION.EDIT:
                return this.getEditComponent()
            default:
                return ''
        }
    }

    showContextAction = (document, action) => {
        const access = document && document.access ? document.access : {}
        const actions = {
            [CONTEXT_MENU_ACTION.VIEW]: access.read,
            [CONTEXT_MENU_ACTION.EDIT]: access.update,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]:
                access.manage || access.externalize,
            [CONTEXT_MENU_ACTION.DELETE]: access.delete,
        }
        return actions[action] || false
    }

    render() {
        const { props } = this
        const { pager } = props
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount)
        const hasPreviousPage = hasPreviousPageCreator(pager.page)
        const paginationCurrentlyShown = calculatePageValue(pager)

        const contextMenuOptions = {
            [CONTEXT_MENU_ACTION.VIEW]: this.viewResource,
            [CONTEXT_MENU_ACTION.EDIT]: this.editResource,
            [CONTEXT_MENU_ACTION.SHARING_SETTINGS]: this.sharingSettings,
            [CONTEXT_MENU_ACTION.DELETE]: this.delete,
        }

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    systemVersion={props.d2.system.version}
                    sectionKey={props.sectionKey}
                />
                <div id="resource-content">
                    <Pagination
                        total={this.props.pager.total}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        onNextPageClick={this.props.goToNextPage}
                        onPreviousPageClick={this.props.goToPrevPage}
                        currentlyShown={paginationCurrentlyShown}
                    />
                    <div id={'search-box-id'} style={styles.searchContainer}>
                        <InputField
                            value={this.props.search}
                            type="text"
                            hintText={i18n.t(i18nKeys.resource.search)}
                            // eslint-disable-next-line
                            onChange={this.props.setSearch}
                        />
                    </div>
                    <Table
                        columns={['displayName']}
                        rows={this.props.resources}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={CONTEXT_MENU_ICONS}
                        isContextActionAllowed={this.showContextAction}
                    />
                    {props.resources.length && props.loadingResources && (
                        <NoResultsMessage />
                    )}
                    <div id={'footer-pagination-id'}>
                        <Pagination
                            total={this.props.pager.total}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            onNextPageClick={this.props.goToNextPage}
                            onPreviousPageClick={this.props.goToPrevPage}
                            currentlyShown={paginationCurrentlyShown}
                        />
                    </div>
                    <div id={'add-resource-btn-container-id'}>
                        <Button
                            id={'add-resource-btn-id'}
                            fab
                            onClick={this.addNewResource}
                            style={appStyles.addButton}
                        >
                            <SvgIcon icon={'Add'} />
                        </Button>
                    </div>
                    {this.getActionComponent()}
                </div>
            </div>
        )
    }
}

Resource.childContextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = state => ({
    loadingResources: state.resource.loading,
    search: state.resource.search,
    resources: state.resource.collection,
    pager: state.pagination,
})
const mapDispatchToProps = dispatch => ({
    loadResources: () => dispatch(loadResources()),
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    setSearch: value => dispatch(setSearch(value)),
})

export const ConnectedResource = connect(
    mapStateToProps,
    mapDispatchToProps
)(manageError(Resource))
