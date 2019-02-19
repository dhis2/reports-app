import { loadHtmlReport, shareDataSetReportComment } from '../asyncThunks'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
    sharingReportCommentStart,
    sharingReportCommentSuccess,
    sharingReportCommentError,
} from '../../htmlReport'
import {
    getDataSetReports,
    postDataSetReportComment,
} from '../../../../utils/api'

jest.mock('../../htmlReport', () => ({
    loadingHtmlReportStart: jest.fn(() => 'loadingHtmlReportStart'),
    loadingHtmlReportSuccess: jest.fn(() => 'loadingHtmlReportSuccess'),
    loadingHtmlReportError: jest.fn(() => 'loadingHtmlReportError'),
    sharingReportCommentStart: jest.fn(() => 'sharingReportCommentStart'),
    sharingReportCommentSuccess: jest.fn(() => 'sharingReportCommentSuccess'),
    sharingReportCommentError: jest.fn(() => 'sharingReportCommentError'),
}))

jest.mock('../../../../utils/api', () => ({
    getDataSetReports: jest.fn(),
    postDataSetReportComment: jest.fn(),
}))

describe('Actions - dataSetReport - Async thunks', () => {
    const dispatch = jest.fn()

    describe('loading the html report', () => {
        const getState = jest.fn(() => ({
            dataSet: { selected: {} },
            dataSetDimensions: {},
            dataSetReport: {},
            organisationUnits: { selected: {} },
            reportPeriod: {},
        }))

        describe('when loading the html report', () => {
            it('should dispatch a start loading action', () => {
                getDataSetReports.mockImplementationOnce(() =>
                    Promise.resolve()
                )

                loadHtmlReport()(dispatch, getState)
                expect(loadingHtmlReportStart).toHaveBeenCalledTimes(1)
                expect(dispatch).toHaveBeenCalledWith('loadingHtmlReportStart')
            })
        })

        describe('when loading the report successfully', () => {
            const report = 'Html Report'

            it('should dispatch a success action', done => {
                getDataSetReports.mockImplementationOnce(() =>
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
                getDataSetReports.mockImplementationOnce(() =>
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

    describe('sharing a data set report comment', () => {
        const getState = jest.fn(() => ({
            dataSet: { selected: {} },
            organisationUnits: { selected: {} },
            reportPeriod: {},
        }))

        afterEach(() => {
            sharingReportCommentStart.mockClear()
            sharingReportCommentSuccess.mockClear()
            sharingReportCommentError.mockClear()
        })

        describe('when sending the comment', () => {
            it('should dispatch a start loading action', () => {
                postDataSetReportComment.mockImplementationOnce(() =>
                    Promise.resolve()
                )

                shareDataSetReportComment()(dispatch, getState)
                expect(sharingReportCommentStart).toHaveBeenCalledTimes(1)
                expect(dispatch).toHaveBeenCalledWith(
                    'sharingReportCommentStart'
                )
            })
        })

        describe('when sharing a comment successfully', () => {
            it('should dispatch a success action', done => {
                postDataSetReportComment.mockImplementationOnce(() =>
                    Promise.resolve()
                )

                shareDataSetReportComment()(dispatch, getState).then(() => {
                    expect(sharingReportCommentSuccess).toHaveBeenCalledTimes(1)
                    expect(dispatch).toHaveBeenCalledWith(
                        'sharingReportCommentSuccess'
                    )
                    done()
                })
            })
        })

        describe('when sharing a comment failed', () => {
            const error = new Error('Custom error')

            it('should dispatch an error action', done => {
                postDataSetReportComment.mockImplementationOnce(() =>
                    Promise.reject(error)
                )

                shareDataSetReportComment()(dispatch, getState).then(() => {
                    expect(sharingReportCommentError).toHaveBeenCalledWith(
                        error
                    )
                    expect(dispatch).toHaveBeenCalledWith(
                        'sharingReportCommentError'
                    )
                    done()
                })
            })
        })
    })
})
