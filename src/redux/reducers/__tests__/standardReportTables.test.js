import {
    loadingStandardReportTablesError,
    loadingStandardReportTablesStart,
    loadingStandardReportTablesSuccess,
} from '../../actions/standardReportTables.js'
import { defaultState, standardReportTables } from '../standardReportTables.js'

describe('Reducer - standardReportTables', () => {
    it('should return the default state', () => {
        expect(standardReportTables()).toEqual(defaultState)
    })

    it('should set loading to true when loading std report tables', () => {
        const action = loadingStandardReportTablesStart()
        const preState = { ...defaultState, loading: false }
        const postState = standardReportTables(preState, action)
        const expectedState = { ...preState, loading: true }

        expect(postState).toEqual(expectedState)
    })

    it('should set the collection and loading to false when successfully loading std report tables', () => {
        const collection = [1, 2, 3, 4]
        const action = loadingStandardReportTablesSuccess(collection)
        const preState = { ...defaultState, loading: true, collection: [] }
        const postState = standardReportTables(preState, action)
        const expectedState = { ...preState, loading: false, collection }

        expect(postState).toEqual(expectedState)
    })

    it('should set loading to false when unsuccessfully loading std report tables', () => {
        const action = loadingStandardReportTablesError()
        const preState = { ...defaultState, loading: true }
        const postState = standardReportTables(preState, action)
        const expectedState = { ...preState, loading: false }

        expect(postState).toEqual(expectedState)
    })
})
