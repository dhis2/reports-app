import { actionTypes } from '../../actions/standardReport';
import standardReport from '../standardReport';
import { defaultState } from '../standardReport';
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from '../../pages/standard-report/standard.report.conf';

describe('Reducer - standardReport', function() {
    const mockReport = () => ({ displayName: 'foobar' });

    it('should return the default state', function() {
        const actual = standardReport();
        const expected = defaultState;
        expect(actual).toEqual(expected);
    });

    describe('loading reports', function() {
        it('should start loading', function() {
            const { LOADING_STANDARD_REPORTS_START } = actionTypes;
            const preState = { ...defaultState, loading: false, loadingError: 'previous error' };
            const actual = standardReport(preState, { type: LOADING_STANDARD_REPORTS_START });
            const expected = { ...defaultState, loading: true, loadingError: '' };
            expect(actual).toEqual(expected);
        });

        it('should capture the error', function() {
            const loadingError = 'Foobar';
            const { LOADING_STANDARD_REPORTS_ERROR } = actionTypes;
            const preState = { ...defaultState, loading: true };
            const actual = standardReport(
                preState,
                { type: LOADING_STANDARD_REPORTS_ERROR, payload: loadingError },
            );
            const expected = { ...defaultState, loading: false, loadingError };

            expect(actual).toEqual(expected);
        });
    });

    describe('page navigation', function() {
        it('should increase the current page num by 1', function() {
            const { GO_TO_NEXT_PAGE } = actionTypes;
            const preState = { ...defaultState, pager: { ...defaultState.pager, page: 1 }};
            const actual = standardReport(preState, { type: GO_TO_NEXT_PAGE });
            const expected = { ...defaultState, pager: { ...defaultState.pager, page: 2 }};
            expect(actual).toEqual(expected);
        });

        it('should decrease the current page num by 1', function() {
            const { GO_TO_PREV_PAGE } = actionTypes;
            const preState = { ...defaultState, pager: { ...defaultState.pager, page: 2 }};
            const actual = standardReport(preState, { type: GO_TO_PREV_PAGE });
            const expected = { ...defaultState, pager: { ...defaultState.pager, page: 1 }};
            expect(actual).toEqual(expected);
        });
    });

    describe('search', function() {
        it('should set the search term', function() {
            const term = 'foobar';
            const { SET_SEARCH } = actionTypes;
            const preState = { ...defaultState, search: 'fooba' };
            const actual = standardReport(preState, { type: SET_SEARCH, payload: term });
            const expected = { ...defaultState, search: term };
            expect(actual).toEqual(expected);
        });
    });

    describe('Using context menu actions', function() {
        let report;
        let preState;
        const {
            ADD_REPORT_FORM_SHOW,
            EDIT_REPORT_FORM_SHOW,
            CREATE_REPORT_SHOW,
            SHARING_SETTINGS_SHOW,
        } = actionTypes;

        beforeEach(function() {
            report = mockReport();
            preState = { ...defaultState, open: false, selectedReport: {}, selectedAction: '' };
        });

        it('should show the add report form', function() {
            const actual = standardReport(
                preState,
                { type: ADD_REPORT_FORM_SHOW, payload: report },
            );
            const expected = {
                ...defaultState,
                open: true,
                selectedReport: report,
                selectedAction: ADD_NEW_REPORT_ACTION,
            };
            expect(actual).toEqual(expected);
        });

        it('should show the edit report form', function() {
            const actual = standardReport(
                preState,
                { type: EDIT_REPORT_FORM_SHOW, payload: report },
            );
            const expected = {
                ...defaultState,
                open: true,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.EDIT,
            };
            expect(actual).toEqual(expected);
        });

        it('should show the create report', function() {
            const actual = standardReport(
                preState,
                { type: CREATE_REPORT_SHOW, payload: report },
            );
            const expected = {
                ...defaultState,
                open: true,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.CREATE,
            };
            expect(actual).toEqual(expected);
        });

        it('should show the sharing settings', function() {
            const actual = standardReport(
                preState,
                { type: SHARING_SETTINGS_SHOW, payload: report },
            );
            const expected = {
                ...defaultState,
                open: true,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Hiding context actions', function() {
        let preState;
        const {
            ADD_REPORT_FORM_HIDE,
            EDIT_REPORT_FORM_HIDE,
            CREATE_REPORT_HIDE,
            SHARIING_SETTINGS_HIDE,
            CLOSE_CONTEXT_MENU,
        } = actionTypes;
        const expected = { ...defaultState, open: false, selectedReport: {}, selectedAction: '' };

        beforeEach(function() {
            preState = { ...defaultState, open: true, selectedReport: mockReport() };
        });

        it('should hide the add report form', function() {
            preState = { ...preState, selectedAction: ADD_NEW_REPORT_ACTION };
            const actual = standardReport(preState, { type: ADD_REPORT_FORM_HIDE });
            expect(actual).toEqual(expected);
        });

        it('should hide the edit report form', function() {
            preState = { ...preState, selectedAction: CONTEXT_MENU_ACTION.EDIT };
            const actual = standardReport(preState, { type: EDIT_REPORT_FORM_HIDE });
            expect(actual).toEqual(expected);
        });

        it('should hide the created report', function() {
            preState = { ...preState, selectedAction: CONTEXT_MENU_ACTION.CREATE };
            const actual = standardReport(preState, { type: CREATE_REPORT_HIDE });
            expect(actual).toEqual(expected);
        });

        it('should hide the sharing settings', function() {
            preState = { ...preState, selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS };
            const actual = standardReport(preState, { type: SHARIING_SETTINGS_HIDE });
            expect(actual).toEqual(expected);
        });

        it('should close the context menu', function() {
            preState = { ...preState, selectedAction: 'any action' };
            const actual = standardReport(preState, { type: CLOSE_CONTEXT_MENU });
            expect(actual).toEqual(expected);
        });
    });

    describe('Deleting a report', function() {
        let report;
        let preState;
        const {
            REQUEST_DELETE_STANDARD_REPORT,
            DELETE_STANDARD_REPORT_START,
            DELETE_STANDARD_REPORT_SUCCESS,
            DELETE_STANDARD_REPORT_ERROR,
        } = actionTypes;

        beforeEach(function() {
            report = mockReport();
            preState = {
                ...defaultState,
                requestDelete: false,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            };
        });

        it('should request the deletion', function() {
            preState = {
                ...defaultState,
                requestDelete: false,
                selectedReport: {},
                selectedAction: '',
            };
            const actual = standardReport(preState, {
                type: REQUEST_DELETE_STANDARD_REPORT,
                payload: report,
            });
            const expected = {
                ...defaultState,
                selectedReport: report,
                requestDelete: true,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
            };
            expect(actual).toEqual(expected);
        });

        it('should start deleting the report', function() {
            preState = { ...preState, requestDelete: true, loadingError: 'previous error' };
            const actual = standardReport(preState, { type: DELETE_STANDARD_REPORT_START });
            const expected = {
                ...defaultState,
                requestDelete: false,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
                loading: true,
                loadingError: '',
            };
            expect(actual).toEqual(expected);
        });

        it('should have deleted the report successfully', function() {
            const actual = standardReport(preState, { type: DELETE_STANDARD_REPORT_SUCCESS });
            const expected = {
                ...defaultState,
                selectedReport: {},
                selectedAction: '',
                loading: false,
                loadingError: '',
            };
            expect(actual).toEqual(expected);
        });

        it('should not have deleted the report successfully', function() {
            const error = 'Error: foobar';
            const actual = standardReport(preState, { 
                type: DELETE_STANDARD_REPORT_ERROR,
                payload: error,
            });
            const expected = {
                ...defaultState,
                selectedReport: report,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
                loading: false,
                loadingError: error,
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Html Reports', function() {
        let htmlReport;
        const {
            HTML_REPORT_SHOW,
            HTML_REPORT_HIDE,
        } = actionTypes;

        beforeEach(function() {
            htmlReport = '<div>Html Report</div>';
        });

        it('should show the htmlReport', function() {
            const preState = { ...defaultState, htmlReport: '' };
            const actual = standardReport(
                preState,
                {
                    type: HTML_REPORT_SHOW,
                    payload: htmlReport,
                },
            );
            const expected = { ...defaultState, htmlReport };
            expect(actual).toEqual(expected);
        });

        it('should hide the htmlReport', function() {
            const preState = { ...defaultState, htmlReport };
            const actual = standardReport(preState, { type: HTML_REPORT_HIDE });
            const expected = { ...defaultState, htmlReport: '' };
            expect(actual).toEqual(expected);
        });
    });
});
