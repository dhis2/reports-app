import { mockStore } from '../../../utils/test-helpers/mockStore'
import { getResources } from '../../../utils/api'
import {
    loadingResourcesStart,
    loadingResourcesSuccess,
    loadingResourcesError,
    loadResources,
} from '../resource'

jest.mock('../../../utils/api', () => ({
    getResources: jest.fn(() => Promise.resolve()),
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
})
