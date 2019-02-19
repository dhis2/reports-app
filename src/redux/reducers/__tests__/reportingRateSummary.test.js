import { actionTypes } from '../../actions/reportingRateSummary'
import { defaultState, reportingRateSummary } from '../reportingRateSummary'

describe('Reducer - reportingRateSummary', () => {
    it('should set the criteria to the paylod value', () => {
        const action = {
            type: actionTypes.SET_SELECTED_CRITERIA,
            payload: 'foo',
        }
        const preState = { ...defaultState, selectedCriteria: '' }
        const postState = reportingRateSummary(preState, action)
        const expected = { ...defaultState, selectedCriteria: 'foo' }

        expect(postState).toEqual(expected)
    })
})
