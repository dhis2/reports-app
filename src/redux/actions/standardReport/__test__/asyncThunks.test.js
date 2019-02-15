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
    startLoadingStandardReports: jest.fn(),
    loadingStandardReportsSuccess: jest.fn(),
    loadingStandardReportsError: jest.fn(),
    deleteStandardReportStart: jest.fn(),
    deleteStandardReportSuccess: jest.fn(),
    deleteStandardReportError: jest.fn(),
}))

jest.mock('../../pagination', () => ({
    setPagination: jest.fn(),
}))

jest.mock('../../../../utils/api', () => ({
    getFilteredStandardReports: jest.fn(),
    deleteStandardReport: jest.fn(),
}))

describe('Actions - Standard Reports - Async Thunks', () => {
    const dispatch = () => null

    describe('loading standard reports', () => {
        const getState = () => ({ pagination: {}, standardReport: {} })
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
                    done()
                })
            })

            it('should dispatch a set pager action', done => {
                loadStandardReports()(dispatch, getState)

                responseSuccess.finally(() => {
                    expect(setPagination).toHaveBeenCalledWith(pager)
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
