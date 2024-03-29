import { connect } from 'react-redux'
import {
    addResource,
    closeContextMenu,
    requestDeleteResource,
    deleteResource,
    editResource,
    goToNextPage,
    goToPrevPage,
    loadResources,
    setSearchAndLoadResources,
    showSharingSettings,
    viewResource,
} from '../../redux/actions/resource.js'

const mapStateToProps = (state) => ({
    open: state.resource.open,
    resources: state.resource.collection,
    selectedAction: state.resource.selectedAction,
    selectedResource: state.resource.selectedResource,
    loadingResources: state.resource.loading,
    search: state.resource.search,
    pager: state.pagination,
})

const mapDispatchToProps = {
    goToNextPage,
    goToPrevPage,
    loadResources,
    requestDeleteResource,
    deleteResource,
    setSearch: (event) => setSearchAndLoadResources(event.target.value),
    addResource,
    viewResource,
    editResource,
    showSharingSettings,
    closeContextMenu,
}

export const connectResource = connect(mapStateToProps, mapDispatchToProps)
