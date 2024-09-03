import { getStandardReportTables } from '../../../utils/api.js'
import { mockStore } from '../../../utils/test-helpers/mockStore.js'
import {
    loadingStandardReportTablesStart,
    loadingStandardReportTablesSuccess,
    loadingStandardReportTablesError,
    loadStandardReportTables,
} from '../standardReportTables.js'

jest.mock('../../../utils/api', () => ({
    getStandardReportTables: jest.fn(() => Promise.resolve()),
}))

describe('Actions - standardReportTables', () => {
    const store = mockStore({
        standardReportTables: {
            searchTerm: 'test',
        },
    })

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getStandardReportTables.mockClear()
    })

    it('should dispatch a loading start action when loading standard report tables', () => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesStart(),
        ])

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should dispatch a success action with the options when loading standard report tables succesfully', () => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesSuccess([
                { value: '1337', label: 'foobar' },
            ]),
        ])

        getStandardReportTables.mockImplementationOnce(() =>
            Promise.resolve([{ id: '1337', displayName: 'foobar' }])
        )

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should dispatch an error action when loading standard report tables unsuccessfully', () => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesError(),
        ])

        getStandardReportTables.mockImplementationOnce(() => Promise.reject())

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
