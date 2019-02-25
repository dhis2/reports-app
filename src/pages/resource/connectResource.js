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

export const connectResource = connect(
    mapStateToProps,
    mapDispatchToProps
)
