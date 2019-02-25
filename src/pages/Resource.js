import React from 'react'
import PropTypes from 'prop-types'
import Table from '@dhis2/d2-ui-table'
import { Button, InputField, Pagination, SvgIcon } from '@dhis2/d2-ui-core'
import '@dhis2/d2-ui-core/build/css/Table.css'
import '@dhis2/d2-ui-core/build/css/Pagination.css'
import { connect } from 'react-redux'
import styles from './resource/Resource.style'
import appStyles from '../utils/styles'
import manageError from '../utils/pageEnhancers/manageError.HOC'
import { resourceActions, contextMenuIcons } from '../utils/resource/constants'
import i18n from '../utils/i18n/locales'
import { i18nKeys } from '../utils/i18n/i18nKeys'

import {
    loadResources,
    goToNextPage,
    goToPrevPage,
    setSearch,
    addResource,
    viewResource,
    editResource,
    showSharingSettings,
    deleteResource,
    closeContextMenu,
} from '../redux/actions/resource'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    calculatePageValue,
} from '../utils/pagination/helper'
import { SectionHeadline } from '../components/SectionHeadline'
import { NoResultsMessage } from '../components/NoResultsMessage'
import { Action } from './resource/Action'

const createContextMenuOptions = props => ({
    [resourceActions.VIEW]: props.viewResource,
    [resourceActions.EDIT]: props.editResource,
    [resourceActions.SHARING_SETTINGS]: props.showSharingSettings,
    [resourceActions.DELETE]: props.deleteResource,
})

export default class Resource extends React.Component {
    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadResources()
    }

    showContextAction = (document, action) => {
        const access = document && document.access ? document.access : {}
        const actions = {
            [resourceActions.VIEW]: access.read,
            [resourceActions.EDIT]: access.update,
            [resourceActions.SHARING_SETTINGS]:
                access.manage || access.externalize,
            [resourceActions.DELETE]: this.props.deleteResource,
        }
        return actions[action] || false
    }

    render() {
        const { props } = this
        const { pager } = props
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount)
        const hasPreviousPage = hasPreviousPageCreator(pager.page)
        const paginationCurrentlyShown = calculatePageValue(pager)
        const contextMenuOptions = createContextMenuOptions(props)

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
                        contextMenuIcons={contextMenuIcons}
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
                            onClick={props.addResource}
                            style={appStyles.addButton}
                        >
                            <SvgIcon icon={'Add'} />
                        </Button>
                    </div>
                    <Action
                        d2={props.d2}
                        open={props.open}
                        selectedAction={props.selectedAction}
                        selectedResource={props.selectedResource}
                        handleClose={props.closeContextMenu}
                        handleError={this.manageError}
                    />
                </div>
            </div>
        )
    }
}

Resource.propTypes = {
    d2: PropTypes.object.isRequired,
    pager: PropTypes.object.isRequired,
    search: PropTypes.string.isRequired,
    resources: PropTypes.array.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    loadResources: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
}

Resource.childContextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = state => ({
    open: state.resource.open,
    loading: state.resource.loading,
    resources: state.resource.collection,
    selectedAction: state.resource.selectedAction,
    selectedResource: state.resource.selectedResource,
    loadingResources: state.resource.loading,
    search: state.resource.search,
    pager: state.pagination,
})

const mapDispatchToProps = dispatch => ({
    loadResources: () => dispatch(loadResources()),
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    setSearch: value => dispatch(setSearch(value)),
    addResource: () => dispatch(addResource()),
    viewResource: resource => dispatch(viewResource(resource)),
    editResource: resource => dispatch(editResource(resource)),
    showSharingSettings: resource => dispatch(showSharingSettings(resource)),
    deleteResource: resource => dispatch(deleteResource(resource)),
    closeContextMenu: refreshList => dispatch(closeContextMenu(refreshList)),
})

export const ConnectedResource = connect(
    mapStateToProps,
    mapDispatchToProps
)(manageError(Resource))
