import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    loadingDimensionsStart,
    loadingDimensionsSuccess,
    loadingDimensionsError,
    loadDimensions,
} from '../dataSetDimensions'
import { getDimensions } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    getDimensions: jest.fn(() => Promise.resolve()),
}))

describe('Actions - dataSetDimensions - asyncThunks', () => {
    const store = mockStore({
        dataSet: { selected: {} },
    })

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getDimensions.mockClear()
    })

    it('should dispatch a start loading action when loading dimensions', () => {
        const expectedActions = expect.arrayContaining([
            loadingDimensionsStart(),
        ])
        store.dispatch(loadDimensions())
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should dispatch a success action with the dimensions when loading dimensions successfully', () => {
        const dimensions = [1, 2, 3, 4]
        const expectedActions = expect.arrayContaining([
            loadingDimensionsSuccess(dimensions),
        ])

        getDimensions.mockImplementationOnce(() => Promise.resolve(dimensions))
        store.dispatch(loadDimensions()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should dispatch an error action with the error when loading dimensions unsuccessfully', () => {
        const expectedActions = expect.arrayContaining([
            loadingDimensionsError(),
        ])

        getDimensions.mockImplementationOnce(() => Promise.reject())
        store.dispatch(loadDimensions()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
