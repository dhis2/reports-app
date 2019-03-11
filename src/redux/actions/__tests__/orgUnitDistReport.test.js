import { mockStore } from '../../../utils/test-helpers/mockStore'
import { getOrgUnitDistReport } from '../../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccess,
    loadingReportDataError,
} from '../reportData'
import { loadReport } from '../orgUnitDistReport'

jest.mock('../../../utils/api', () => ({
    getOrgUnitDistReport: jest.fn(() => Promise.resolve()),
}))

describe('Actions - orgUnitDistReport', () => {
    const store = mockStore({
        organisationUnits: { selected: {} },
        orgUnitGroupSets: {},
    })

    beforeEach(() => {
        store.clearActions()
    })

    afterEach(() => {
        getOrgUnitDistReport.mockClear()
    })

    it('should dispatch a loading start action when loading data set options', done => {
        const expectedActions = expect.arrayContaining([
            loadingReportDataStart(),
        ])

        store.dispatch(loadReport()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch a success action with the options when loading data set options succesfully', done => {
        const report = 'Report'
        const expectedActions = expect.arrayContaining([
            loadingReportDataSuccess(report),
        ])

        getOrgUnitDistReport.mockImplementationOnce(() =>
            Promise.resolve(report)
        )

        store.dispatch(loadReport()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })

    it('should dispatch an error action when loading the data set options unsuccessfully', done => {
        const expectedActions = expect.arrayContaining([
            loadingReportDataError(),
        ])

        getOrgUnitDistReport.mockImplementationOnce(() => Promise.reject())

        store.dispatch(loadReport()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
            done()
        })
    })
})
