import { defaultState, loading } from '../loading'
import { actionTypes as dataSetActionTypes } from '../../actions/dataSet'
import { actionTypes as htmlReportActionTypes } from '../../actions/htmlReport'
import { ACTION_TYPES as organisationUnitsActionTypes } from '../../actions/organisationUnits'
import { ACTION_TYPES as reportPeriodActionTypes } from '../../actions/reportPeriod'
import { actionTypes as standardReportActionTypes } from '../../actions/standardReport'

describe('Reducer - loading', () => {
    describe('start loading', () => {
        let action
        const preState = {
            ...defaultState,
            loading: false,
            error: 'Error from previous loading',
        }
        const expectedState = {
            ...defaultState,
            loading: true,
            error: '',
        }

        afterEach(() => {
            const postState = loading(preState, action)
            expect(postState).toEqual(expectedState)
        })

        it('should set loading to true when loading data set options', () => {
            action = { type: dataSetActionTypes.LOADING_DATA_SET_OPTIONS_START }
        })

        it('should set loading to true when loading data set dimensions', () => {
            action = { type: dataSetActionTypes.LOADING_DIMENSIONS_START }
        })

        it('should set loading to true when loading the html report', () => {
            action = { type: htmlReportActionTypes.LOADING_HTML_REPORT_START }
        })

        it('should set loading to true when sharing a html report comment', () => {
            action = {
                type:
                    htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_START,
            }
        })

        it('should set loading to true when loading organisation units', () => {
            action = {
                type:
                    organisationUnitsActionTypes.ORGANISATION_UNITS_LOADING_START,
            }
        })

        it('should set loading to true when loading orginsation unit group sets', () => {
            action = {
                type: organisationUnitsActionTypes.LOADING_GROUP_SETS_START,
            }
        })

        it('should set loading to true when loading period types', () => {
            action = {
                type: reportPeriodActionTypes.REPORT_PERIOD_TYPES_LOADING_START,
            }
        })

        it('should set loading to true when loading standard reports', () => {
            action = {
                type: standardReportActionTypes.LOADING_STANDARD_REPORTS_START,
            }
        })

        it('should set loading to true when deleting a standard report', () => {
            action = {
                type: standardReportActionTypes.DELETE_STANDARD_REPORT_START,
            }
        })
    })

    describe('loading success', () => {
        let action
        const preState = {
            ...defaultState,
            loading: true,
            error: '',
        }
        const expectedState = {
            ...defaultState,
            loading: false,
        }

        afterEach(() => {
            const postState = loading(preState, {
                ...action,
                payload: 'anything',
            })
            expect(postState).toEqual(expectedState)
        })

        it('should set loading to true when loading data set options', () => {
            action = {
                type: dataSetActionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS,
            }
        })

        it('should set loading to true when loading data set dimensions', () => {
            action = { type: dataSetActionTypes.LOADING_DIMENSIONS_SUCCESS }
        })

        it('should set loading to true when loading the html report', () => {
            action = { type: htmlReportActionTypes.LOADING_HTML_REPORT_SUCCESS }
        })

        it('should set loading to true when sharing a html report comment', () => {
            action = {
                type:
                    htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_SUCCESS,
            }
        })

        it('should set loading to true when loading organisation units', () => {
            action = {
                type: organisationUnitsActionTypes.ORGANISATION_UNITS_RECEIVED,
            }
        })

        it('should set loading to true when loading orginsation unit group sets', () => {
            action = {
                type: organisationUnitsActionTypes.LOADING_GROUP_SETS_SUCCESS,
            }
        })

        it('should set loading to true when loading period types', () => {
            action = {
                type: reportPeriodActionTypes.REPORT_PERIOD_TYPES_RECEIVED,
            }
        })

        it('should set loading to true when loading standard reports', () => {
            action = {
                type:
                    standardReportActionTypes.LOADING_STANDARD_REPORTS_SUCCESS,
            }
        })

        it('should set loading to true when deleting a standard report', () => {
            action = {
                type: standardReportActionTypes.DELETE_STANDARD_REPORT_SUCCESS,
            }
        })
    })

    describe('loading failure', () => {
        let action
        const errorMessage = 'Custom error message'
        const preState = {
            ...defaultState,
            loading: true,
            error: '',
        }
        const expectedState = {
            ...defaultState,
            loading: false,
            error: errorMessage,
        }

        afterEach(() => {
            const postState = loading(preState, {
                ...action,
                payload: errorMessage,
            })
            expect(postState).toEqual(expectedState)
        })

        it('should set loading to true when loading data set options', () => {
            action = { type: dataSetActionTypes.LOADING_DATA_SET_OPTIONS_ERROR }
        })

        it('should set loading to true when loading data set dimensions', () => {
            action = { type: dataSetActionTypes.LOADING_DIMENSIONS_ERROR }
        })

        it('should set loading to true when loading the html report', () => {
            action = { type: htmlReportActionTypes.LOADING_HTML_REPORT_ERROR }
        })

        it('should set loading to true when sharing a html report comment', () => {
            action = {
                type:
                    htmlReportActionTypes.SHARING_DATA_SET_REPORT_COMMENT_ERROR,
            }
        })

        it('should set loading to true when loading organisation units', () => {
            action = {
                type: organisationUnitsActionTypes.ORGANISATION_UNITS_ERRORED,
            }
        })

        it('should set loading to true when loading orginsation unit group sets', () => {
            action = {
                type: organisationUnitsActionTypes.LOADING_GROUP_SETS_ERROR,
            }
        })

        it('should set loading to true when loading period types', () => {
            action = {
                type: reportPeriodActionTypes.REPORT_PERIOD_TYPES_ERRORED,
            }
        })

        it('should set loading to true when loading standard reports', () => {
            action = {
                type: standardReportActionTypes.LOADING_STANDARD_REPORTS_ERROR,
            }
        })

        it('should set loading to true when deleting a standard report', () => {
            action = {
                type: standardReportActionTypes.DELETE_STANDARD_REPORT_ERROR,
            }
        })
    })
})
