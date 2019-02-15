import { loadStandardReports, deleteStandardReport } from '../asyncThunks'
import {
    getFilteredStandardReports,
    deleteStandardReport as deleteStandardReportRequest,
} from '../../../../utils/api'
import { defaultState as INITIAL_PAGER } from '../../../reducers/pagination'
import { setPagination } from '../../pagination'
import {
    startLoadingStandardReports,
    loadingStandardReportsSuccess,
    loadingStandardReportsError,
    deleteStandardReportStart,
    deleteStandardReportSuccess,
    deleteStandardReportError,
} from '../../standardReport'

jest.mock('../../standardReport', () => ({
    startLoadingStandardReports: jest.fn(() => 'startLoadingStandardReports'),
    loadingStandardReportsSuccess: jest.fn(
        () => 'loadingStandardReportsSuccess'
    ),
    loadingStandardReportsError: jest.fn(() => 'loadingStandardReportsError'),
    deleteStandardReportStart: jest.fn(() => 'deleteStandardReportStart'),
    deleteStandardReportSuccess: jest.fn(() => 'deleteStandardReportSuccess'),
    deleteStandardReportError: jest.fn(() => 'deleteStandardReportError'),
}))

jest.mock('../../pagination', () => ({
    setPagination: jest.fn(() => 'setPagination'),
}))

jest.mock('../../../../utils/api', () => ({
    getFilteredStandardReports: jest.fn(),
    deleteStandardReport: jest.fn(),
}))

describe('Actions - Standard Reports - Async Thunks', () => {
    const dispatch = jest.fn()

    describe('loading standard reports', () => {
        const getState = jest.fn(() => ({ pagination: {}, standardReport: {} }))
        const reports = [1, 2, 3, 4]
        const pager = INITIAL_PAGER
        const responseSuccess = Promise.resolve({ reports, pager })

        afterEach(() => {
            startLoadingStandardReports.mockClear()
            loadingStandardReportsSuccess.mockClear()
            loadingStandardReportsError.mockClear()
        })

        describe('when loading the standard reports', () => {
            it('should dispatch astart loading action', () => {
                getFilteredStandardReports.mockImplementationOnce(
                    () => responseSuccess
                )
                loadStandardReports()(dispatch, getState)
                expect(startLoadingStandardReports).toHaveBeenCalledTimes(1)
                expect(dispatch).toHaveBeenCalledWith(
                    'startLoadingStandardReports'
                )
            })
        })

        describe('when retrieval was successful', () => {
            beforeEach(() => {
                getFilteredStandardReports.mockImplementationOnce(
                    () => responseSuccess
                )
            })

            it('should dispatch a success action', done => {
                loadStandardReports()(dispatch, getState)

                responseSuccess.finally(() => {
                    expect(loadingStandardReportsSuccess).toHaveBeenCalledWith(
                        reports
                    )
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingStandardReportsSuccess'
                    )
                    done()
                })
            })

            it('should dispatch a set pager action', done => {
                loadStandardReports()(dispatch, getState)

                responseSuccess.finally(() => {
                    expect(setPagination).toHaveBeenCalledWith(pager)
                    expect(dispatch).toHaveBeenCalledWith('setPagination')
                    done()
                })
            })
        })

        describe('when retrieval failure', () => {
            it('should dispatch the error action', done => {
                getFilteredStandardReports.mockImplementationOnce(() =>
                    Promise.reject()
                )

                loadStandardReports()(dispatch, getState).then(() => {
                    expect(loadingStandardReportsError).toHaveBeenCalledTimes(1)
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingStandardReportsError'
                    )
                    done()
                })
            })
        })
    })

    describe('deleting standard reports', () => {
        const getState = () => ({
            standardReport: { selectedReport: {} },
        })

        afterEach(() => {
            deleteStandardReportStart.mockClear()
            deleteStandardReportSuccess.mockClear()
            deleteStandardReportError.mockClear()
        })

        describe('when requesting the deletion', () => {
            it('should dispatch a loading start action', () => {
                deleteStandardReportRequest.mockImplementationOnce(() =>
                    Promise.resolve()
                )
                deleteStandardReport()(dispatch, getState)
                expect(deleteStandardReportStart).toHaveBeenCalledTimes(1)
            })
        })

        describe('when deleting successfully', () => {
            it('should dispatch a success action', done => {
                deleteStandardReportRequest.mockImplementationOnce(() =>
                    Promise.resolve()
                )
                deleteStandardReport()(dispatch, getState).then(() => {
                    expect(deleteStandardReportSuccess).toHaveBeenCalledTimes(1)
                    done()
                })
            })
        })

        describe('when deleting unsuccessfully', () => {
            it('should dispatch a error action', done => {
                deleteStandardReportRequest.mockImplementationOnce(() =>
                    Promise.reject()
                )
                deleteStandardReport()(dispatch, getState).then(() => {
                    expect(deleteStandardReportError).toHaveBeenCalledTimes(1)
                    done()
                })
            })
        })
    })
})
