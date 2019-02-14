import { actionTypes } from '../../actions/dataSetReport'
import { actionTypes as reportHtmlActionTypes } from '../../actions/htmlReport'
import { dataSetReport, defaultState } from '../dataSetReport'

describe('Reducer - dataSetReport', () => {
    it('should return the default state when called with no state', () => {
        expect(dataSetReport()).toEqual(defaultState)
    })

    it('should set the showForm to true', () => {
        const action = { type: actionTypes.SHOW_DATA_SET_REPORT_FORM }
        const preState = { ...defaultState, showForm: false }
        const postState = dataSetReport(preState, action)
        const expected = { ...defaultState, showForm: true }

        expect(postState).toEqual(expected)
    })

    it('should set the showForm to false', () => {
        const action = {
            type: reportHtmlActionTypes.LOADING_HTML_REPORT_SUCCESS,
        }
        const preState = { ...defaultState, showForm: true }
        const postState = dataSetReport(preState, action)
        const expected = { ...defaultState, showForm: false }

        expect(postState).toEqual(expected)
    })

    it('should set the selectedUnitOnly to the payload', () => {
        const action = {
            type: actionTypes.TOGGLE_SELECTED_UNIT_ONLY,
            payload: true,
        }
        const preState = { ...defaultState, selectedUnitOnly: false }
        const postState = dataSetReport(preState, action)
        const expected = { ...defaultState, selectedUnitOnly: true }

        expect(postState).toEqual(expected)
    })
})
