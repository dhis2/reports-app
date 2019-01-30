import { actionTypes } from '../actions/standardReport';
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
    REPORTS_ENDPOINT,
} from '../pages/standard-report/standard.report.conf';

export const defaultState = {
    pager: INITIAL_PAGER,
    reports: [],
    selectedReport: null,
    selectedAction: null,
    search: '',
    open: false,
    htmlReport: null,
    loading: false,
    loadingError: '',
};

export const standardReport = (state = defaultState, { type, payload }) => {
    switch (type) {
        case actionTypes.LOADING_STANDARD_REPORTS_START:
            return { ...state, loading: true, loadingError: '' }

        case actionTypes.LOADING_STANDARD_REPORTS_ERROR:
            return { ...state, loading: false, loadingError: payload }

        case actionTypes.LOADING_STANDARD_REPORTS_SUCCESS:
            return { ...state, loading: false, loadingError: '', reports: payload }

        case actionTypes.SET_PAGE:
            return {
                ...state,
                pager: { ...state.pager, page: payload },
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

        default:
            return state;
    }
};
