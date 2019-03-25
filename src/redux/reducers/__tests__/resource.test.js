import {
    addResource,
    deleteResourceError,
    deleteResourceStart,
    deleteResourceSuccess,
    editResource,
    loadingResourcesError,
    loadingResourcesStart,
    loadingResourcesSuccess,
    resetContextMenu,
    setSearch,
    showSharingSettings,
} from '../../actions/resource'
import { defaultSelectedResource, defaultState, resource } from '../resource'
import { resourceActions } from '../../../utils/resource/constants'

describe('Reducer - resource', () => {
    const selectedResource = { id: 'foo', displayName: 'bar' }

    it('should return the default state', () => {
        expect(resource()).toEqual(defaultState)
    })

    it('should set loading to true and clear the collection when loading resources', () => {
        const action = loadingResourcesStart()
        const preState = {
            ...defaultState,
            collection: [1, 2, 3],
            loading: false,
        }
        const postState = resource(preState, action)
        const expectedState = { ...preState, collection: [], loading: true }

        expect(postState).toEqual(expectedState)
    })

    it('should set the collection when successfully loading the resources', () => {
        const collection = [1, 2, 3, 4]
        const action = loadingResourcesSuccess(collection)
        const preState = { ...defaultState, loading: true, collection: [] }
        const postState = resource(preState, action)
        const expectedState = { ...defaultState, loading: false, collection }

        expect(postState).toEqual(expectedState)
    })

    it('should set loading to false when unsuccessfully loading the resources', () => {
        const action = loadingResourcesError()
        const preState = { ...defaultState, loading: true }
        const postState = resource(preState, action)
        const expectedState = { ...preState, loading: false }

        expect(postState).toEqual(expectedState)
    })

    it('should set the search term', () => {
        const action = setSearch('term')
        const preState = { ...defaultState, search: '' }
        const postState = resource(preState, action)
        const expectedState = { ...preState, search: 'term' }

        expect(postState).toEqual(expectedState)
    })

    it('should set the edit resource action', () => {
        const action = editResource(selectedResource)
        const preState = {
            ...defaultState,
            open: false,
            selectedResource: { id: 'bar', displayName: 'baz' },
            selectedAction: '',
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            open: true,
            selectedAction: resourceActions.EDIT,
            selectedResource,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should set the show sharing settings action', () => {
        const action = showSharingSettings(selectedResource)
        const preState = {
            ...defaultState,
            open: false,
            selectedResource: '',
            selectedAction: '',
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            open: true,
            selectedAction: resourceActions.SHARING_SETTINGS,
            selectedResource,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should set the show sharing settings action', () => {
        const action = addResource()
        const preState = {
            ...defaultState,
            open: false,
            selectedAction: '',
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            open: true,
            selectedAction: resourceActions.NEW,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should set loading to true when deleting a resource', () => {
        const action = deleteResourceStart()
        const preState = {
            ...defaultState,
            loading: false,
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            loading: true,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should set loading to false when successfully deleting a resource', () => {
        const action = deleteResourceSuccess()
        const preState = {
            ...defaultState,
            loading: true,
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            loading: false,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should set loading to false when unsuccessfully deleting a resource', () => {
        const action = deleteResourceError()
        const preState = {
            ...defaultState,
            loading: true,
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            loading: false,
        }

        expect(postState).toEqual(expectedState)
    })

    it('should reset the context menu', () => {
        const action = resetContextMenu()
        const preState = {
            ...defaultState,
            open: true,
            selectedAction: 'foo',
            selectedResource,
        }
        const postState = resource(preState, action)
        const expectedState = {
            ...preState,
            open: false,
            selectedAction: '',
            selectedResource: defaultSelectedResource,
        }

        expect(postState).toEqual(expectedState)
    })
})
