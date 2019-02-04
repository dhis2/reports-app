import { actionTypes } from '../actions/standardReport';
import {
    ADD_NEW_REPORT_ACTION,
    CONTEXT_MENU_ACTION,
} from '../../pages/standard-report/standard.report.conf';
import { INITIAL_PAGER } from '../../utils/pagination';
import { ACTION_MESSAGE, ERROR, LOADING, SUCCESS } from '../../utils/feedbackSnackBarTypes';
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

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
    showFeedback: false,
    feedbackConf: {},
};

// eslint-disable-next-line complexity
const standardReport = (state = defaultState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case actionTypes.LOADING_STANDARD_REPORTS_START:
            return {
                ...state,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: { type: LOADING },
            };

        case actionTypes.LOADING_STANDARD_REPORTS_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
                showFeedback: true,
                feedbackConf: {
                    type: ERROR,
                    message: payload,
                },
            };

        case actionTypes.LOADING_STANDARD_REPORTS_SUCCESS:
            return {
                ...state,
                loading: false,
                loadingError: '',
                reports: payload.reports,
                pager: payload.pager,
                showFeedback: true,
                feedbackConf: {
                    type: SUCCESS,
                    message: payload.successMessage,
                },
            };

        case actionTypes.GO_TO_NEXT_PAGE:
            return {
                ...state,
                pager: { ...state.pager, page: state.pager.page + 1 },
            };

        case actionTypes.GO_TO_PREV_PAGE:
            return {
                ...state,
                pager: { ...state.pager, page: state.pager.page - 1 },
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
        case actionTypes.CLOSE_CONTEXT_MENU:
            return {
                ...state,
                open: false,
                selectedReport: {},
                selectedAction: '',
            };

        case actionTypes.REQUEST_DELETE_STANDARD_REPORT:
            return {
                ...state,
                requestDelete: true,
                selectedReport: payload,
                selectedAction: CONTEXT_MENU_ACTION.DELETE,
                showFeedback: true,
                feedbackConf: {
                    type: ACTION_MESSAGE,
                    message: payload.displayName,
                    action: i18n.t(i18nKeys.messages.confirmDelete),
                },
            };

        case actionTypes.DELETE_STANDARD_REPORT_START:
            return {
                ...state,
                requestDelete: false,
                loading: true,
                loadingError: '',
                showFeedback: true,
                feedbackConf: { type: LOADING },
            };

        case actionTypes.DELETE_STANDARD_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                loadingError: '',
                selectedReport: {},
                selectedAction: '',
                showFeedback: false,
            };

        case actionTypes.DELETE_STANDARD_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                loadingError: payload,
                showFeedback: true,
                feedbackConf: {
                    type: ERROR,
                    message: payload,
                },
            };

        case actionTypes.HTML_REPORT_SHOW:
            return { ...state, htmlReport: payload };

        case actionTypes.HTML_REPORT_HIDE:
            return { ...state, htmlReport: '' };

        default:
            return state;
    }
};

export default standardReport;
export {
    defaultState,
};
