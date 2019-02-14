import { actionTypes as dataSetActionTypes } from '../actions/dataSet';
import { actionTypes as htmlReportActionTypes } from '../actions/htmlReport';
import { ACTION_TYPES as organisationUnitsActionTypes } from '../actions/organisationUnits';
import { ACTION_TYPES as reportPeriodActionTypes } from '../actions/reportPeriod';
import { actionTypes as standardReportActionTypes } from '../actions/standardReport';

export const defaultState = {
    loading: false,
    error: '',
}

export const loading = (state = defaultState, { type, payload } = {}) => {
    switch (type) {
        case dataSetActionTypes.LOADING_DATA_SET_OPTIONS_START:
        case dataSetActionTypes.LOADING_DIMENSIONS_START:
        case htmlReportActionTypes.LOADING_HTML_REPORT_START:
        case htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_START:
        case organisationUnitsActionTypes.ORGANISATION_UNITS_LOADING_START:
        case organisationUnitsActionTypes.LOADING_GROUP_SETS_START:
        case reportPeriodActionTypes.REPORT_PERIOD_TYPES_LOADING_START:
        case standardReportActionTypes.LOADING_STANDARD_REPORTS_START:
        case standardReportActionTypes.DELETE_STANDARD_REPORT_START:
            return {
                ...state,
                loading: true,
                error: '',
            }

        case dataSetActionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS:
        case dataSetActionTypes.LOADING_DIMENSIONS_SUCCESS:
        case htmlReportActionTypes.LOADING_HTML_REPORT_SUCCESS:
        case htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_SUCCESS:
        case organisationUnitsActionTypes.ORGANISATION_UNITS_RECEIVED:
        case organisationUnitsActionTypes.LOADING_GROUP_SETS_SUCCESS:
        case reportPeriodActionTypes.REPORT_PERIOD_TYPES_RECEIVED:
        case standardReportActionTypes.LOADING_STANDARD_REPORTS_SUCCESS:
        case standardReportActionTypes.DELETE_STANDARD_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
            }

        case dataSetActionTypes.LOADING_DATA_SET_OPTIONS_ERROR:
        case dataSetActionTypes.LOADING_DIMENSIONS_ERROR:
        case htmlReportActionTypes.LOADING_HTML_REPORT_ERROR:
        case htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_ERROR:
        case organisationUnitsActionTypes.ORGANISATION_UNITS_ERRORED:
        case organisationUnitsActionTypes.LOADING_GROUP_SETS_ERROR:
        case reportPeriodActionTypes.REPORT_PERIOD_TYPES_ERRORED:
        case standardReportActionTypes.LOADING_STANDARD_REPORTS_ERROR:
        case standardReportActionTypes.DELETE_STANDARD_REPORT_ERROR:
            return {
                ...state,
                loading: false,
                error: payload,
            }

        default:
            return state;
    }
}
