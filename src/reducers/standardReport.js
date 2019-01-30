import { actionTypes } from '../actions/standardReport';
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from '../pages/standard-report/standard.report.conf';
import { INITIAL_PAGER } from '../helpers/pagination';

const defaultState = {
    pager: INITIAL_PAGER,
    reports: [],
    selectedReport: {},
    selectedAction: '',
    search: '',
    open: false,
    htmlReport: '',
    loading: false,
    loadingError: '',
    requestDelete: false,
};

const standardReport = (state = defaultState, { type, payload }) => {
    switch (type) {
    case actionTypes.LOADING_STANDARD_REPORTS_START:
        return { ...state, loading: true, loadingError: '' };

    case actionTypes.LOADING_STANDARD_REPORTS_ERROR:
        return { ...state, loading: false, loadingError: payload };

    case actionTypes.LOADING_STANDARD_REPORTS_SUCCESS:
        return {
            ...state,
            loading: false,
            loadingError: '',
            reports: payload.reports,
            pager: payload.pager,
        };

    case actionTypes.SET_PAGE:
        return {
            ...state,
            pager: { ...state.pager, page: payload },
        };

    case actionTypes.SET_SEARCH:
        return {
            ...state,
            search: payload,
        };

    case actionTypes.ADD_REPORT_FORM_SHOW:
        return {
            ...state,
            open: true,
            selectedReport: payload,
            selectedAction: ADD_NEW_REPORT_ACTION,
        };

    case actionTypes.EDIT_REPORT_FORM_SHOW:
        return {
            ...state,
            open: true,
            selectedReport: payload,
            selectedAction: CONTEXT_MENU_ACTION.EDIT,
        };

    case actionTypes.CREATE_REPORT_SHOW:
        return {
            ...state,
            open: true,
            selectedReport: payload,
            selectedAction: CONTEXT_MENU_ACTION.CREATE,
        };

    case actionTypes.SHARING_SETTINGS_SHOW:
        return {
            ...state,
            open: true,
            selectedReport: payload,
            selectedAction: CONTEXT_MENU_ACTION.SHARING_SETTINGS,
        };

    case actionTypes.ADD_REPORT_FORM_HIDE:
    case actionTypes.EDIT_REPORT_FORM_HIDE:
    case actionTypes.CREATE_REPORT_HIDE:
    case actionTypes.SHARIING_SETTINGS_HIDE:
        return { ...state, open: false };

    case actionTypes.REQUEST_DELETE_STANDARD_REPORT:
        return {
            ...state,
            requestDelete: true,
            selectedReport: payload,
            selectedAction: CONTEXT_MENU_ACTION.DELETE,
        };

    case actionTypes.DELETE_STANDARD_REPORT_START:
        return { ...state, requestDelete: false, loading: true, loadingError: '' };

    case actionTypes.DELETE_STANDARD_REPORT_SUCCESS:
        return { ...state, loading: false, loadingError: '' };

    case actionTypes.DELETE_STANDARD_REPORT_ERROR:
        return { ...state, loading: false, loadingError: payload };

    case actionTypes.HTML_REPORT_SHOW:
        return { ...state, htmlReport: payload };

    case actionTypes.HTML_REPORT_HIDE:
        return { ...state, htmlReport: '' };

    case actionTypes.CLOSE_CONTEXT_MENU:
        return {
            ...state,
            open: false,
            selectedAction: '',
            selectedReport: {},
        };

    default:
        return state;
    }
};

export default standardReport;
