import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Snackbar } from '../components/feedback/Snackbar.js'
import SearchablePagedList from '../components/SearchablePagedList.js'
import { SectionHeadline } from '../components/SectionHeadline.js'
import { RESOURCE_SECTION_KEY, sections } from '../config/sections.config.js'
import {
    contextMenuIcons,
    resourceActions,
} from '../utils/resource/constants.js'
import { connectResource } from './resource/connectResource.js'
import { showContextAction } from './resource/helper.js'
import ResourceActions from './resource/ResourceActions.js'

const createContextMenuOptions = (props) => ({
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

    componentDidMount() {
        if (this.props.resources.length === 0) {
            this.props.loadResources()
        }
    }

    render() {
        return (
            <div>
                <SectionHeadline
                    label={sections[RESOURCE_SECTION_KEY].info.label}
                    sectionKey={RESOURCE_SECTION_KEY}
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
    addResource: PropTypes.func.isRequired,
    closeContextMenu: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    loadResources: PropTypes.func.isRequired,
    loadingResources: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    resources: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    selectedAction: PropTypes.string.isRequired,
    selectedResource: PropTypes.object.isRequired,
    setSearch: PropTypes.func.isRequired,
}

const ConnectedResource = connectResource(Resource)

export { ConnectedResource as Resource }
