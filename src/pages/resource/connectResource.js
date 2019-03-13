import { connect } from 'react-redux'

import {
    addNewResource,
    addResource,
    closeContextMenu,
    deleteResource,
    editResource,
    goToNextPage,
    goToPrevPage,
    loadResources,
    setSearchAndLoadResources,
    showSharingSettings,
    updateResource,
    viewResource,
} from '../../redux/actions/resource'
import { extractFileAndFormattedResource } from './helper'

const mapStateToProps = state => ({
    open: state.resource.open,
    resources: state.resource.collection,
    selectedAction: state.resource.selectedAction,
    selectedResource: state.resource.selectedResource,
    loadingResources: state.resource.loading,
    search: state.resource.search,
    pager: state.pagination,
})

const mapDispatchToProps = dispatch => ({
    goToNextPage: () => dispatch(goToNextPage()),
    goToPrevPage: () => dispatch(goToPrevPage()),
    loadResources: () => dispatch(loadResources()),
    deleteResource: () => dispatch(deleteResource()),
    setSearch: term => dispatch(setSearchAndLoadResources(term)),
    addResource: (...values) => dispatch(addResource(...values)),
    viewResource: (...values) => dispatch(viewResource(...values)),
    editResource: (...values) => dispatch(editResource(...values)),
    showSharingSettings: (...values) =>
        dispatch(showSharingSettings(...values)),
    closeContextMenu: (...values) => dispatch(closeContextMenu(...values)),
    addNewResource: values => {
        const { file, resource } = extractFileAndFormattedResource(values)
        console.log('add new', file, resource)
        //dispatch(addNewResource(resource, file))
    },
    updateResource: values => {
        console.log('update', values)
        const { file, resource } = extractFileAndFormattedResource(values)
        //dispatch(updateResource(resource, file))
    },
})

export const connectResource = connect(
    mapStateToProps,
    mapDispatchToProps
)
