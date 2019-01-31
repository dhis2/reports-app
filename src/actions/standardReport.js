import { REPORTS_ENDPOINT } from '../pages/standard-report/standard.report.conf';

export const actionTypes = {
    LOAD_STANDARD_REPORTS: 'LOAD_STANDARD_REPORTS',
    LOADING_STANDARD_REPORTS_START: 'LOADING_STANDARD_REPORTS_START',
    LOADING_STANDARD_REPORTS_SUCCESS: 'LOADING_STANDARD_REPORTS_SUCCESS',
    LOADING_STANDARD_REPORTS_ERROR: 'LOADING_STANDARD_REPORTS_ERROR',
    GO_TO_NEXT_PAGE: 'GO_TO_NEXT_PAGE',
    GO_TO_PREV_PAGE: 'GO_TO_PREV_PAGE',
    SET_SEARCH: 'SET_SEARCH',
    ADD_REPORT_FORM_SHOW: 'ADD_REPORT_FORM_SHOW',
    ADD_REPORT_FORM_HIDE: 'ADD_REPORT_FORM_HIDE',
    EDIT_REPORT_FORM_SHOW: 'EDIT_REPORT_FORM_SHOW',
    EDIT_REPORT_FORM_HIDE: 'EDIT_REPORT_FORM_HIDE',
    CREATE_REPORT_SHOW: 'CREATE_REPORT_SHOW',
    CREATE_REPORT_HIDE: 'CREATE_REPORT_HIDE',
    SHARING_SETTINGS_SHOW: 'SHARING_SETTINGS_SHOW',
    SHARING_SETTINGS_HIDE: 'SHARING_SETTINGS_HIDE',
    REQUEST_DELETE_STANDARD_REPORT: 'REQUEST_DELETE_STANDARD_REPORT',
    DELETE_STANDARD_REPORT_START: 'DELETE_STANDARD_REPORT_START',
    DELETE_STANDARD_REPORT_SUCCESS: 'DELETE_STANDARD_REPORT_SUCCESS',
    DELETE_STANDARD_REPORT_ERROR: 'DELETE_STANDARD_REPORT_ERROR',
    HTML_REPORT_SHOW: 'HTML_REPORT_SHOW',
    HTML_REPORT_HIDE: 'HTML_REPORT_HIDE',
    CLOSE_CONTEXT_MENU: 'CLOSE_CONTEXT_MENU',
};

/**
 * @returns {Object}
 */
export const startLoadingStandardReports = () => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_START,
});

/**
 * @param {Array} reports
 * @returns {Object}
 */
export const loadingStandardReportsSuccess = reports => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_SUCCESS,
    payload: reports,
});

/**
 * @param {string} error
 * @returns {Object}
 */
export const loadingStandardReportsError = error => ({
    type: actionTypes.LOADING_STANDARD_REPORTS_ERROR,
    payload: error,
});

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {string} search
 * @returns {string}
 */
// tslint-disable no-confusing-arrow
const createReportsApiUrl = (page, pageSize, search) => [
    `${REPORTS_ENDPOINT}?page=${page}&pageSize=${pageSize}`,
    '&fields=displayName,type,id,reportTable[id,displayName],access',
    search ? `&filter=displayName:ilike:${search}` : '',
].join('');
// tslint-enable no-confusing-arrow

/**
 * @return {Function} Redux thunk
 */
export const loadStandardReports = d2 => (dispatch, getState) => {
    const api = d2.Api.getApi();
    const { pager, search } = getState().standardReport;
    const { page, pageSize } = pager;
    const url = createReportsApiUrl(page, pageSize, search);

    dispatch(startLoadingStandardReports());
    api.get(url)
        .then(response =>
            dispatch(loadingStandardReportsSuccess(response)))
        .catch(error =>
            dispatch(loadingStandardReportsError(error)))
    ;
};

/**
 * @param {number} nextPage
 * @return {Object}
 */
export const goToNextPage = () => (dispatch) => {
    dispatch({ type: actionTypes.GO_TO_NEXT_PAGE });
    dispatch(loadStandardReports());
};

/**
 * @param {number} nextPage
 * @return {Object}
 */
export const goToPrevPage = () => (dispatch) => {
    dispatch({ type: actionTypes.GO_TO_PREV_PAGE });
    dispatch(loadStandardReports());
};

// workaround for debouncing loading reports while typing in the search field
let timeoutId = null;
export const DEBOUNCE_DELAY = 500;

/**
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
export const setSearch = searchTerm => (dispatch) => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: searchTerm });

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        dispatch(loadStandardReports());
        timeoutId = null;
    }, DEBOUNCE_DELAY);
};

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const addReportFormShow = report => ({
    type: actionTypes.ADD_REPORT_FORM_SHOW,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const addReportFormHide = report => ({
    type: actionTypes.ADD_REPORT_FORM_HIDE,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const editReportFormShow = report => ({
    type: actionTypes.EDIT_REPORT_FORM_SHOW,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const editReportFormHide = report => ({
    type: actionTypes.EDIT_REPORT_FORM_HIDE,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const createReportShow = report => ({
    type: actionTypes.CREATE_REPORT_SHOW,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const createReportHide = report => ({
    type: actionTypes.CREATE_REPORT_HIDE,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const sharingSettingsShow = report => ({
    type: actionTypes.SHARING_SETTINGS_SHOW,
    payload: report,
});

/**
 * @param {Object} report A d2 report model
 * @return {Object}
 */
export const sharingSettingsHide = report => ({
    type: actionTypes.SHARIING_SETTINGS_HIDE,
    payload: report,
});

/**
 * Used to get a confirmation from the user
 * @return {Object}
 */
export const requestDeleteStandardReport = report => ({
    type: actionTypes.REQUEST_DELETE_STANDARD_REPORT,
    payload: report,
});

/**
 * @return {Object}
 */
export const deleteStandardReportStart = () => ({
    type: actionTypes.DELETE_STANDARD_REPORT_START,
});

/**
 * @return {Object}
 */
export const deleteStandardReportSuccess = () => (dispatch) => {
    dispatch({ type: actionTypes.DELETE_STANDARD_REPORT_SUCCESS });
    dispatch(loadStandardReports());
};

/**
 * @return {Object}
 */
export const deleteStandardReportError = error => ({
    type: actionTypes.DELETE_STANDARD_REPORT_ERROR,
    payload: error,
});

/**
 * @param {Object} report
 * @return {Function} A redux thunk
 */
export const deleteStandardReport = (d2, report) =>
    (dispatch) => {
        const api = d2.Api.getApi();
        const url = `${REPORTS_ENDPOINT}/${report.id}`;

        dispatch(deleteStandardReportStart());

        api.delete(url)
            .then(() => dispatch(deleteStandardReportSuccess()))
            .catch(error => dispatch(deleteStandardReportError(error)))
        ;
    }
;

/**
 * @returns {Object}
 */
export const closeContextMenu = refreshList => (dispatch) => {
    dispatch({ type: actionTypes.CLOSE_CONTEXT_MENU });

    if (refreshList) {
        dispatch(loadStandardReports());
    }
};

/**
 * @param {string} htmlReport
 * @returns {Object}
 */
export const showHtmlReport = htmlReport => (dispatch) => {
    dispatch({ type: actionTypes.HTML_REPORT_SHOW, payload: htmlReport });
    dispatch(closeContextMenu());
};

/**
 * @returns {Object}
 */
export const hideHtmlReport = () => ({
    type: actionTypes.HTML_REPORT_HIDE,
});
