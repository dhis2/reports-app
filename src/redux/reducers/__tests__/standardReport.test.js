import { actionTypes } from '../../actions/standardReport'
import { standardReport, defaultState } from '../standardReport'
import { CONTEXT_MENU_ACTION } from '../../../pages/standard-report/standard.report.conf'

describe('Reducer - standardReport', function() {
    const mockReport = () => ({ displayName: 'foobar' })

    it('should return the default state', function() {
        const actual = standardReport()
        const expected = defaultState
        expect(actual).toEqual(expected)
    })

    describe('loading reports', function() {
        const {
            LOADING_STANDARD_REPORTS_START,
            LOADING_STANDARD_REPORTS_ERROR,
        } = actionTypes

        it('should start loading', function() {
            const action = { type: LOADING_STANDARD_REPORTS_START }
            const preState = {
                ...defaultState,
                loading: false,
            }
            const expected = {
                ...defaultState,
                loading: true,
            }
            const actual = standardReport(preState, action)
            expect(actual).toEqual(expected)
        })

        it('should set loading to false on error', function() {
            const loadingError = 'Foobar'
            const action = {
                type: LOADING_STANDARD_REPORTS_ERROR,
                payload: loadingError,
            }
            const preState = {
                ...defaultState,
                loading: true,
            }
            const expected = {
                ...defaultState,
                loading: false,
            }
            const actual = standardReport(preState, action)

            expect(actual).toEqual(expected)
        })
    })

    describe('search', function() {
        it('should set the search term', function() {
            const term = 'foobar'
            const { SET_SEARCH } = actionTypes
            const preState = { ...defaultState, search: 'fooba' }
            const expected = { ...defaultState, search: term }
            const actual = standardReport(preState, {
                type: SET_SEARCH,
                payload: term,
            })
            expect(actual).toEqual(expected)
        })
    })

    describe('Using context menu actions', function() {
        let report
        let preState
        const { SHARING_SETTINGS_SHOW } = actionTypes

        beforeEach(function() {
            report = mockReport()
            preState = {
                ...defaultState,
                open: false,
                selectedReport: {},
                selectedAction: '',
            }
        })

        it('should show the sharing settings', function() {
            const expected = {
                ...defaultState,
                open: true,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
            }
            const actual = standardReport(preState, {
                type: SHARING_SETTINGS_SHOW,
                payload: report,
            })
            expect(actual).toEqual(expected)
        })
    })

    describe('Hiding context actions', function() {
        let preState
        const { CLOSE_CONTEXT_MENU } = actionTypes
        const expected = {
            ...defaultState,
            open: false,
            selectedReport: {},
            selectedAction: '',
        }

        beforeEach(function() {
            preState = {
                ...defaultState,
                open: true,
                selectedReport: mockReport(),
            }
        })

        it('should close the context menu', function() {
            preState = { ...preState, selectedAction: 'any action' }
            const actual = standardReport(preState, {
                type: CLOSE_CONTEXT_MENU,
            })
            expect(actual).toEqual(expected)
        })
    })

    describe('Deleting a report', function() {
        let report
        let preState
        const {
            REQUEST_DELETE_STANDARD_REPORT,
            DELETE_STANDARD_REPORT_START,
            DELETE_STANDARD_REPORT_SUCCESS,
            DELETE_STANDARD_REPORT_ERROR,
        } = actionTypes

        beforeEach(function() {
            report = mockReport()
            preState = {
                ...defaultState,
                requestDelete: false,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            }
        })

        it('should request the deletion', function() {
            preState = {
                ...defaultState,
                requestDelete: false,
                selectedReport: {},
                selectedAction: '',
            }
            const expected = {
                ...defaultState,
                selectedReport: report,
                requestDelete: true,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            }
            const actual = standardReport(preState, {
                type: REQUEST_DELETE_STANDARD_REPORT,
                payload: report,
            })
            expect(actual).toEqual(expected)
        })

        it('should start deleting the report', function() {
            preState = {
                ...preState,
                requestDelete: true,
            }
            const expected = {
                ...defaultState,
                loading: true,
                requestDelete: false,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            }
            const action = { type: DELETE_STANDARD_REPORT_START }
            const actual = standardReport(preState, action)
            expect(actual).toEqual(expected)
        })

        it('should have deleted the report successfully', function() {
            const action = { type: DELETE_STANDARD_REPORT_SUCCESS }
            const postState = standardReport(preState, action)
            const expected = {
                ...defaultState,
                selectedReport: {},
                selectedAction: '',
            }
            expect(postState).toEqual(expected)

            const loadingPreState = {
                ...defaultState,
                loading: true,
            }
            const loadingPostState = standardReport(loadingPreState, action)
            const expectedLoadingState = {
                ...defaultState,
                loading: false,
            }
            expect(loadingPostState).toEqual(expectedLoadingState)
        })

        it('should not have deleted the report successfully', function() {
            const action = {
                type: DELETE_STANDARD_REPORT_ERROR,
                payload: '',
            }
            const expected = {
                ...defaultState,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            }
            const actual = standardReport(preState, action)
            expect(actual).toEqual(expected)

            const preLoadingState = {
                ...defaultState,
                loading: true,
            }
            const postLoadingState = standardReport(preLoadingState, action)
            const expectedLoadingState = {
                ...defaultState,
                loading: false,
            }

            expect(postLoadingState).toEqual(expectedLoadingState)
        })
    })
})
