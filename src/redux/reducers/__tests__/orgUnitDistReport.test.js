import { actionTypes } from '../../actions/orgUnitDistReport.js'
import { orgUnitDistReport, defaultState } from '../orgUnitDistReport.js'

describe('Reducer - orgUnitDistReport', () => {
    it('should return the default state', () => {
        expect(orgUnitDistReport()).toEqual(defaultState)
    })

    it('should toggle should show start to true', () => {
        const action = { type: actionTypes.SET_CHART_OUTPUT }
        const preState = { shouldShowChart: false }
        const postState = orgUnitDistReport(preState, action)
        const expected = { shouldShowChart: true }

        expect(postState).toEqual(expected)
    })

    it('should toggle should show start to false', () => {
        const action = { type: actionTypes.SET_TABULAR_OUTPUT }
        const preState = { shouldShowChart: true }
        const postState = orgUnitDistReport(preState, action)
        const expected = { shouldShowChart: false }

        expect(postState).toEqual(expected)
    })
})
