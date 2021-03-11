import { getOrgUnitDistReport } from '../../../utils/api'
import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    setOutputToChart,
    setOutputToTabular,
    loadChart,
    loadTable,
    loadReport,
} from '../orgUnitDistReport'
import {
    actionTypes as reportDataActions,
    loadingReportDataStart,
    loadingReportDataSuccess,
    loadingReportDataError,
} from '../reportData'

jest.mock('../../../utils/api', () => ({
    getOrgUnitDistReport: jest.fn(() => Promise.resolve()),
}))

describe('Actions - orgUnitDistReport', () => {
    const store = mockStore({
        organisationUnits: {
            selected: {
                id: '1',
                displayName: 'Selected org unit',
            },
        },
        orgUnitGroupSets: { selected: '2' },
        orgUnitDistReport: { shouldShowChart: false },
    })

    describe('loading the report', () => {
        afterEach(() => {
            store.clearActions()
            getOrgUnitDistReport.mockClear()
        })

        it('Should displatch start and success actions if request is successful', () => {
            const expectedActions = expect.arrayContaining([
                loadingReportDataStart(),
                loadingReportDataSuccess(),
            ])
            store.dispatch(loadReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('Should displatch start and error actions if request fails', () => {
            const expectedActions = expect.arrayContaining([
                loadingReportDataStart(),
                loadingReportDataError(),
            ])
            getOrgUnitDistReport.mockImplementationOnce(() =>
                Promise.reject({})
            )
            store.dispatch(loadReport()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })
    })

    describe('toggling between table and chart output', () => {
        it('loadTable should set output to table and start loading the report', () => {
            const expectedActions = expect.arrayContaining([
                setOutputToTabular(),
                { type: reportDataActions.LOADING_REPORT_DATA_START },
            ])
            store.dispatch(loadTable())
            expect(store.getActions()).toEqual(expectedActions)
        })

        it('loadChart should set output to chart and start loading the report', () => {
            const expectedActions = expect.arrayContaining([
                setOutputToChart(),
                { type: reportDataActions.LOADING_REPORT_DATA_START },
            ])
            store.dispatch(loadChart())
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
