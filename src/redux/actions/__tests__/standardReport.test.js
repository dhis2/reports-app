import {
    getFilteredStandardReports,
    deleteStandardReport as deleteStandardReportRequest,
} from '../../../utils/api.js'
import { mockStore } from '../../../utils/test-helpers/mockStore.js'
import { defaultState as INITIAL_PAGER } from '../../reducers/pagination.js'
import { setPagination } from '../pagination.js'
import {
    startLoadingStandardReports,
    loadingStandardReportsSuccess,
    loadingStandardReportsError,
    deleteStandardReportStart,
    deleteStandardReportSuccess,
    deleteStandardReportError,
    loadStandardReports,
    deleteStandardReport,
} from '../standardReport.js'

jest.mock('../../../utils/api', () => ({
    getFilteredStandardReports: jest.fn(),
    deleteStandardReport: jest.fn(),
}))

describe('Actions - Standard Reports - Async Thunks', () => {
    describe('loading standard reports', () => {
        const store = mockStore({
            pagination: {},
            standardReport: {},
        })
        const reports = [1, 2, 3, 4]
        const pager = INITIAL_PAGER

        afterEach(() => {
            store.clearActions()
            getFilteredStandardReports.mockClear()
        })

        it('should dispatch astart loading action when loading the standard reports', () => {
            const expectedActions = expect.arrayContaining([
                startLoadingStandardReports(),
            ])
            getFilteredStandardReports.mockImplementationOnce(() =>
                Promise.resolve()
            )

            store.dispatch(loadStandardReports()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('should dispatch a success and set pager action when retrieval was successful', () => {
            const responseSuccess = Promise.resolve({ reports, pager })
            const expectedActions = expect.arrayContaining([
                loadingStandardReportsSuccess(reports),
                setPagination(pager),
            ])
            getFilteredStandardReports.mockImplementationOnce(
                () => responseSuccess
            )

            store.dispatch(loadStandardReports()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('should dispatch the error action when retrieval failure', () => {
            const expectedActions = expect.arrayContaining([
                loadingStandardReportsError(),
            ])
            getFilteredStandardReports.mockImplementationOnce(() =>
                Promise.reject()
            )

            store.dispatch(loadStandardReports()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })
    })

    describe('deleting standard reports', () => {
        const store = mockStore({
            standardReport: { selectedReport: {} },
        })

        afterEach(() => {
            store.clearActions()
            deleteStandardReportRequest.mockClear()
        })

        it('should dispatch a loading start action when requesting the deletion', () => {
            const expectedActions = expect.arrayContaining([
                deleteStandardReportStart(),
            ])
            deleteStandardReportRequest.mockImplementationOnce(() =>
                Promise.resolve()
            )

            store.dispatch(deleteStandardReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('should dispatch a success action when deleting successfully', () => {
            const expectedActions = expect.arrayContaining([
                deleteStandardReportSuccess(),
            ])
            deleteStandardReportRequest.mockImplementationOnce(() =>
                Promise.resolve()
            )

            store.dispatch(deleteStandardReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('should dispatch a error action when deleting unsuccessfully', () => {
            const expectedActions = expect.arrayContaining([
                deleteStandardReportError(),
            ])
            deleteStandardReportRequest.mockImplementationOnce(() =>
                Promise.reject()
            )

            store.dispatch(deleteStandardReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })
    })
})
