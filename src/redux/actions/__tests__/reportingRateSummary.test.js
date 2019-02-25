import { mockStore } from '../../../utils/test-helpers/mockStore'
import { getReportingRateSummaryReport } from '../../../utils/api'
import {
    loadingReportDataStart,
    loadingReportDataSuccess,
    loadingReportDataError,
} from '../reportData'
import { loadReportData } from '../reportingRateSummary'

jest.mock('../../../utils/api', () => ({
    getReportingRateSummaryReport: jest.fn(() => Promise.resolve()),
}))

describe('Actions - reportingRateSummary - async thunks', () => {
    describe('loading the html report', () => {
        const store = mockStore({
            organisationUnits: { selected: {} },
            dataSet: { selected: {} },
            reportPeriod: {},
            reportingRateSummary: {},
        })

        afterEach(() => {
            store.clearActions()
            getReportingRateSummaryReport.mockClear()
        })

        it('should dispatch a start loading action when loading the html report', done => {
            const expectedActions = expect.arrayContaining([
                loadingReportDataStart(),
            ])

            store.dispatch(loadReportData()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch a success action when loading the report successfully', done => {
            const report = 'Html Report'
            const expectedActions = expect.arrayContaining([
                loadingReportDataSuccess(report),
            ])
            getReportingRateSummaryReport.mockImplementationOnce(() =>
                Promise.resolve(report)
            )

            store.dispatch(loadReportData()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch an error action when loading the html report fails', done => {
            const expectedActions = expect.arrayContaining([
                loadingReportDataError(),
            ])
            getReportingRateSummaryReport.mockImplementationOnce(() =>
                Promise.reject()
            )

            store.dispatch(loadReportData()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })
})
