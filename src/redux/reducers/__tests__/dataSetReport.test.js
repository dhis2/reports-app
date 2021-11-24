import { actionTypes } from '../../actions/dataSetReport.js'
import { dataSetReport, defaultState } from '../dataSetReport.js'

describe('Reducer - dataSetReport', () => {
    it('should return the default state when called with no state', () => {
        expect(dataSetReport()).toEqual(defaultState)
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
