import { connect } from 'react-redux'
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
} from '../../redux/actions/resource'

const mapStateToProps = state => ({
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
    deleteResource,
    setSearch,
    addResource,
    viewResource,
    editResource,
    showSharingSettings,
    closeContextMenu,
}

export const connectResource = connect(
    mapStateToProps,
    mapDispatchToProps
)
