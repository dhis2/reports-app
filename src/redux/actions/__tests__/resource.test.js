import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    getResources,
    deleteResource as sendDeleteResourceRequest,
} from '../../../utils/api'
import {
    loadingResourcesStart,
    loadingResourcesSuccess,
    loadingResourcesError,
    deleteResourceStart,
    deleteResourceSuccess,
    deleteResourceError,
    loadResources,
    deleteResource,
} from '../resource'

jest.mock('../../../utils/api', () => ({
    getResources: jest.fn(() => Promise.resolve()),
    deleteResource: jest.fn(() => Promise.resolve()),
}))

describe('Actions - resource', () => {
    const store = mockStore({
        pagination: {},
        resource: {},
    })

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getResources.mockClear()
    })

    describe('loading resources', () => {
        it('should dispatch a loading start action when loading resources', done => {
            const expectedActions = expect.arrayContaining([
                loadingResourcesStart(),
            ])

            store.dispatch(loadResources()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch a success action with the options when loading resources succesfully', done => {
            const documents = [1, 2, 3, 4]
            const expectedActions = expect.arrayContaining([
                loadingResourcesSuccess(documents),
            ])

            getResources.mockImplementationOnce(() =>
                Promise.resolve({ documents })
            )

            store.dispatch(loadResources()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch an error action when loading the resources unsuccessfully', done => {
            const expectedActions = expect.arrayContaining([
                loadingResourcesError(),
            ])

            getResources.mockImplementationOnce(() => Promise.reject())

            store.dispatch(loadResources()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })

    describe('deleting resources', () => {
        const resource = { id: '1337' }

        it('should dispatch a loading start action when deleting resources', done => {
            const expectedActions = expect.arrayContaining([
                deleteResourceStart(),
            ])

            store.dispatch(deleteResource(resource)).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch a success action with the options when deleting resources succesfully', done => {
            const expectedActions = expect.arrayContaining([
                deleteResourceSuccess(),
            ])

            sendDeleteResourceRequest.mockImplementationOnce(() =>
                Promise.resolve()
            )

            store.dispatch(deleteResource(resource)).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch an error action when deleting resources unsuccessfully', done => {
            const expectedActions = expect.arrayContaining([
                deleteResourceError(),
            ])

            sendDeleteResourceRequest.mockImplementationOnce(() =>
                Promise.reject()
            )

            store.dispatch(deleteResource(resource)).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })
})
