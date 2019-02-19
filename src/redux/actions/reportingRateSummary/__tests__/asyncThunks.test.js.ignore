import { getReportingRateSummaryReport } from '../../../../utils/api'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
} from '../../htmlReport'
import { loadHtmlReport } from '../asyncThunks'

jest.mock('../../htmlReport', () => ({
    loadingHtmlReportStart: jest.fn(() => 'loadingHtmlReportStart'),
    loadingHtmlReportSuccess: jest.fn(() => 'loadingHtmlReportSuccess'),
    loadingHtmlReportError: jest.fn(() => 'loadingHtmlReportError'),
}))

jest.mock('../../../../utils/api', () => ({
    getReportingRateSummaryReport: jest.fn(() => Promise.resolve()),
}))

describe('Actions - reportingRateSummary - async thunks', () => {
    const dispatch = jest.fn()

    describe('loading the html report', () => {
        const getState = jest.fn(() => ({
            organisationUnits: { selected: {} },
            dataSet: { selected: {} },
            reportPeriod: {},
            reportingRateSummary: {},
        }))

        afterEach(() => {
            loadingHtmlReportStart.mockClear()
            loadingHtmlReportSuccess.mockClear()
            loadingHtmlReportError.mockClear()
        })

        describe('when loading the html report', () => {
            it('should dispatch a start loading action', () => {
                loadHtmlReport()(dispatch, getState)
                expect(loadingHtmlReportStart).toHaveBeenCalledTimes(1)
                expect(dispatch).toHaveBeenCalledWith('loadingHtmlReportStart')
            })
        })

        describe('when loading the report successfully', () => {
            const report = 'Html Report'

            it('should dispatch a success action', done => {
                getReportingRateSummaryReport.mockImplementationOnce(() =>
                    Promise.resolve(report)
                )

                loadHtmlReport()(dispatch, getState).then(() => {
                    expect(loadingHtmlReportSuccess).toHaveBeenCalledWith(
                        report
                    )
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingHtmlReportSuccess'
                    )
                    done()
                })
            })
        })

        describe('when loading the html report fails', () => {
            const error = new Error('Custom error')

            it('should dispatch an error action', done => {
                getReportingRateSummaryReport.mockImplementationOnce(() =>
                    Promise.reject(error)
                )

                loadHtmlReport()(dispatch, getState).then(() => {
                    expect(loadingHtmlReportError).toHaveBeenCalledWith(error)
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingHtmlReportError'
                    )
                    done()
                })
            })
        })
    })
})
