import { getDataSetOptions } from '../../../utils/api'
import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    loadingDataSetOptionsStart,
    loadingDataSetOptionsSuccess,
    loadingDataSetOptionsError,
    loadDataSetOptions,
} from '../dataSet'

jest.mock('../../../utils/api', () => ({
    getDataSetOptions: jest.fn(() => Promise.resolve()),
}))

describe('Actions - dataSet', () => {
    const store = mockStore({})

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getDataSetOptions.mockClear()
    })

    it('should dispatch a loading start action when loading data set options', () => {
        const expectedActions = expect.arrayContaining([
            loadingDataSetOptionsStart(),
        ])

        store.dispatch(loadDataSetOptions()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should dispatch a success action with the options when loading data set options succesfully', () => {
        const dataSetOptions = [1, 2, 3, 4]
        const expectedActions = expect.arrayContaining([
            loadingDataSetOptionsSuccess(dataSetOptions),
        ])

        getDataSetOptions.mockImplementationOnce(() =>
            Promise.resolve(dataSetOptions)
        )

        store.dispatch(loadDataSetOptions()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should dispatch an error action when loading the data set options unsuccessfully', () => {
        const expectedActions = expect.arrayContaining([
            loadingDataSetOptionsError(),
        ])

        getDataSetOptions.mockImplementationOnce(() => Promise.reject())

        store.dispatch(loadDataSetOptions()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
