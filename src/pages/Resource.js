import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Snackbar } from '../components/feedback/Snackbar'
import SearchablePagedList from '../components/SearchablePagedList'
import { SectionHeadline } from '../components/SectionHeadline'
import { contextMenuIcons, resourceActions } from '../utils/resource/constants'
import { connectResource } from './resource/connectResource'
import { showContextAction } from './resource/helper'
import ResourceActions from './resource/ResourceActions'

const createContextMenuOptions = props => ({
    [resourceActions.VIEW]: props.viewResource,
    [resourceActions.EDIT]: props.editResource,
    [resourceActions.SHARING_SETTINGS]: props.showSharingSettings,
    [resourceActions.DELETE]: props.requestDeleteResource,
})

class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.contextMenuOptions = createContextMenuOptions(props)
    }

    getChildContext() {
        return { d2: this.props.d2 }
    }

    componentDidMount() {
        if (this.props.resources.length === 0) {
            this.props.loadResources()
        }
    }

    render() {
        return (
            <div>
                <SectionHeadline
                    label={i18n.t('Resource')}
                    systemVersion={this.props.d2.system.version}
                    sectionKey={this.props.sectionKey}
                />
                <div id="resource-content">
                    <SearchablePagedList
                        columns={['displayName']}
                        rows={this.props.resources}
                        isLoading={this.props.loadingResources}
                        contextMenuActions={this.contextMenuOptions}
                        primaryAction={
                            this.contextMenuOptions[resourceActions.VIEW]
                        }
                        contextMenuIcons={contextMenuIcons}
                        isContextActionAllowed={showContextAction(
                            this.props.deleteResource
                        )}
                        searchInputValue={this.props.search}
                        searchInputChangeHandler={this.props.setSearch}
                        addButtonClickHandler={this.props.addResource}
                        goToNextPage={this.props.goToNextPage}
                        goToPrevPage={this.props.goToPrevPage}
                    />
                    <ResourceActions
                        d2={this.props.d2}
                        open={this.props.open}
                        selectedAction={this.props.selectedAction}
                        selectedResource={this.props.selectedResource}
                        handleClose={this.props.closeContextMenu}
                    />
                    <Snackbar
                        action={i18n.t('CONFIRM')}
                        onActionClick={this.props.deleteResource}
                    />
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
    requestDeleteResource: PropTypes.func.isRequired,
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
