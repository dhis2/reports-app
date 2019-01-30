export const DEBOUNCE_DELAY = 500;

export const actionTypes = createActionTypes(
    'LOAD_STANDARD_REPORTS',
    'LOADING_STANDARD_REPORTS_START',
    'LOADING_STANDARD_REPORTS_SUCCESS',
    'LOADING_STANDARD_REPORTS_ERROR',
    'SET_PAGE',
    'ADD_REPORT_FORM_SHOW',
    'ADD_REPORT_FORM_HIDE',
    'EDIT_REPORT_FORM_SHOW',
    'EDIT_REPORT_FORM_HIDE',
    'CREATE_REPORT_SHOW',
    'CREATE_REPORT_HIDE',
    'SHARING_SETTINGS_SHOW',
    'SHARING_SETTINGS_HIDE',
);

/**
 * @param {number} nextPage
 * @return {Object}
 */
export const setPage = nextPage => (dispatch, getState) => {
    dispatch({ type: actionTypes.SET_PAGE, payload: nextPage });
    dispatch(loadStandartReports());
};

// workaround for debouncing loading reports while typing in the search field
let timeoutId = null;
/**
 * @param {string} searchTerm
 * @return {Function} Redux thunk
 */
export const setSearch = searchTerm => dispatch => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: searchTerm });

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        dispatch(loadStandartReports());
        timeoutId = null;
    }, DEBOUNCE_DELAY);
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
const createReportsApiUrl = (page, pageSize, search) =>
    `${REPORTS_ENDPOINT}?page=${page}&pageSize=${pageSize}`
    + '&fields=displayName,type,id,reportTable[id,displayName],access'
    + search ? `&filter=displayName:ilike:${search}` : ''
;

/**
 * @return {Function} Redux thunk
 */
export const loadStandartReports = () => (dispatch, getState) => {
        const api = this.props.d2.Api.getApi();
        const { pager, search } = getState();
        const { page, pageSize } = pager;
        const url = createReportsApiUrl(page, pageSize, search);

        dispatch(startLoadingStandardReports());
        api.get(url)
            .then(response =>
                dispatch(loadingStandardReportsSuccess(response)))
            .catch(error =>
                dispatch(loadingStandardReportsError(error)))
        ;
    }
;

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
