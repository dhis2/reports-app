import { mockStore } from '../../../utils/test-helpers/mockStore'
import { getStandardReportTables } from '../../../utils/api'
import {
    loadingStandardReportTablesStart,
    loadingStandardReportTablesSuccess,
    loadingStandardReportTablesError,
    loadStandardReportTables,
} from '../standardReportTables'

jest.mock('../../../utils/api', () => ({
    getStandardReportTables: jest.fn(() => Promise.resolve()),
}))

describe('Actions - standardReportTables', () => {
    const store = mockStore({})

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getStandardReportTables.mockClear()
    })

    it('should dispatch a loading start action when loading standard report tables', done => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesStart(),
        ])

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a success action with the options when loading standard report tables succesfully', done => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesSuccess([
                { value: '1337', label: 'foobar' },
            ]),
        ])

        getStandardReportTables.mockImplementationOnce(() =>
            Promise.resolve({ reportTables: [{ id: '1337', name: 'foobar' }] })
        )

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch an error action when loading standard report tables unsuccessfully', done => {
        const expectedActions = expect.arrayContaining([
            loadingStandardReportTablesError(),
        ])

        getStandardReportTables.mockImplementationOnce(() => Promise.reject())

        store.dispatch(loadStandardReportTables()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })
})
