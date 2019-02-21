import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    loadingHtmlReportStart,
    loadingHtmlReportSuccess,
    loadingHtmlReportError,
    sharingReportCommentStart,
    sharingReportCommentSuccess,
    sharingReportCommentError,
} from '../htmlReport'
import { loadHtmlReport, shareDataSetReportComment } from '../dataSetReport'
import { getDataSetReports, postDataSetReportComment } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    getDataSetReports: jest.fn(() => Promise.resolve()),
    postDataSetReportComment: jest.fn(() => Promise.resolve()),
}))

describe('Actions - dataSetReport - Async thunks', () => {
    const dispatch = jest.fn()

    describe('loading the html report', () => {
        const store = mockStore({
            dataSet: { selected: {} },
            dataSetDimensions: {},
            dataSetReport: {},
            organisationUnits: { selected: {} },
            reportPeriod: {},
        })

        afterEach(() => {
            store.clearActions()
            getDataSetReports.mockClear()
        })

        it('should dispatch a start loading action when loading the html report', () => {
            const expectedActions = expect.arrayContaining([
                loadingHtmlReportStart(),
            ])
            getDataSetReports.mockImplementationOnce(() => Promise.resolve())

            store.dispatch(loadHtmlReport())
            expect(store.getActions()).toEqual(expectedActions)
        })

        it('should dispatch a success action when loading the report successfully', done => {
            const report = 'Html Report'
            const expectedActions = expect.arrayContaining([
                loadingHtmlReportSuccess(report),
            ])
            getDataSetReports.mockImplementationOnce(() =>
                Promise.resolve(report)
            )

            store.dispatch(loadHtmlReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch an error action when loading the html report fails', done => {
            const expectedActions = expect.arrayContaining([
                loadingHtmlReportError(),
            ])
            getDataSetReports.mockImplementationOnce(() => Promise.reject())

            store.dispatch(loadHtmlReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })

    describe('sharing a data set report comment', () => {
        const store = mockStore({
            dataSet: { selected: {} },
            organisationUnits: { selected: {} },
            reportPeriod: {},
        })

        afterEach(() => {
            store.clearActions()
            postDataSetReportComment.mockClear()
        })

        it('should dispatch a start loading action when sending the comment', done => {
            const expectedActions = expect.arrayContaining([
                sharingReportCommentStart(),
            ])

            store.dispatch(shareDataSetReportComment()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch a success action when sharing a comment successfully', done => {
            const expectedActions = expect.arrayContaining([
                sharingReportCommentSuccess(),
            ])

            store.dispatch(shareDataSetReportComment()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch an error action when sharing a comment failed', done => {
            postDataSetReportComment.mockImplementationOnce(() =>
                Promise.reject()
            )
            const expectedActions = expect.arrayContaining([
                sharingReportCommentError(),
            ])

            store.dispatch(shareDataSetReportComment()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })
})
