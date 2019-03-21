import React from 'react'
import PropTypes from 'prop-types'
import Table from '@dhis2/d2-ui-table'
import { Button, InputField, Pagination, SvgIcon } from '@dhis2/d2-ui-core'
import '@dhis2/d2-ui-core/css/Table.css'
import '@dhis2/d2-ui-core/css/Pagination.css'
import styles from './resource/Resource.style'
import appStyles from '../utils/styles'
import { resourceActions, contextMenuIcons } from '../utils/resource/constants'
import i18n from '@dhis2/d2-i18n'
import { connectResource } from './resource/connectResource'
import {
    hasNextPageCreator,
    hasPreviousPageCreator,
    calculatePageValue,
} from '../utils/pagination/helper'
import { Snackbar } from '../components/feedback/Snackbar'
import { SectionHeadline } from '../components/SectionHeadline'
import { NoResultsMessage } from '../components/NoResultsMessage'
import { Action } from './resource/Action'
import { showContextAction } from './resource/helper'

const createContextMenuOptions = props => ({
    [resourceActions.VIEW]: props.viewResource,
    [resourceActions.EDIT]: props.editResource,
    [resourceActions.SHARING_SETTINGS]: props.showSharingSettings,
    [resourceActions.DELETE]: props.deleteResource,
})

class Resource extends React.Component {
    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        this.props.loadResources()
    }

    render() {
        const { pager } = this.props
        const hasNextPage = hasNextPageCreator(pager.page, pager.pageCount)
        const hasPreviousPage = hasPreviousPageCreator(pager.page)
        const paginationCurrentlyShown = calculatePageValue(pager)
        const contextMenuOptions = createContextMenuOptions(this.props)

        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
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
                            hintText={i18n.t('Search')}
                            // eslint-disable-next-line
                            onChange={this.props.setSearch}
                        />
                    </div>
                    <Table
                        columns={['displayName']}
                        rows={this.props.resources}
                        contextMenuActions={contextMenuOptions}
                        contextMenuIcons={contextMenuIcons}
                        isContextActionAllowed={showContextAction(
                            this.props.deleteResource
                        )}
                        primaryAction={contextMenuOptions[resourceActions.VIEW]}
                    />
                    {!this.props.resources.length &&
                        !this.props.loadingResources && <NoResultsMessage />}
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
                            onClick={this.props.addResource}
                            style={appStyles.addButton}
                        >
                            <SvgIcon icon={'Add'} />
                        </Button>
                    </div>
                    <Action
                        d2={this.props.d2}
                        open={this.props.open}
                        selectedAction={this.props.selectedAction}
                        selectedResource={this.props.selectedResource}
                        handleClose={this.props.closeContextMenu}
                    />
                    <Snackbar />
                </div>
            </div>
        )
    }
}

Resource.propTypes = {
    d2: PropTypes.object.isRequired,
    sectionKey: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    loadingResources: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    selectedAction: PropTypes.string.isRequired,
    resources: PropTypes.array.isRequired,
    pager: PropTypes.object.isRequired,
    selectedResource: PropTypes.object.isRequired,

    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    loadResources: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired,
    addResource: PropTypes.func.isRequired,
    viewResource: PropTypes.func.isRequired,
    editResource: PropTypes.func.isRequired,
    showSharingSettings: PropTypes.func.isRequired,
    closeContextMenu: PropTypes.func.isRequired,
}

Resource.childContextTypes = {
    d2: PropTypes.object,
}

const ConnectedResource = connectResource(Resource)

export { ConnectedResource as Resource }
