import reducer, { ACTIONS, initialState } from '../reportPeriod'

describe('Reducer - reportPeriod', () => {
    const mockCollection = [
        { id: '1', displayName: '1' },
        { id: '2', displayName: '2' },
        { id: '3', displayName: '3' },
    ]
    const errorStr = 'Oops'
    const stateWithPeriodTypeSelected = {
        ...initialState,
        ready: true,
        collection: mockCollection,
        selectedPeriodType: mockCollection[0],
    }
    const stateWithBothSelected = {
        ...stateWithPeriodTypeSelected,
        selectedPeriod: 'dummyValue',
    }

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle REPORT_PERIOD_TYPES_RECEIVED correctly', () => {
        const action = {
            type: ACTIONS.REPORT_PERIOD_TYPES_RECEIVED,
            payload: mockCollection,
        }
        const expectedState = {
            ...initialState,
            collection: mockCollection,
            ready: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
    it('should handle REPORT_PERIOD_TYPES_ERRORED correctly', () => {
        const action = {
            type: ACTIONS.REPORT_PERIOD_TYPES_ERRORED,
            payload: errorStr,
        }
        const expectedState = {
            ...initialState,
            loadingError: errorStr,
            ready: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
    it('should handle REPORT_PERIOD_TYPE_SELECTED correctly', () => {
        const action = {
            type: ACTIONS.REPORT_PERIOD_TYPE_SELECTED,
            payload: mockCollection[1],
        }
        const expectedState = {
            ...stateWithPeriodTypeSelected,
            selectedPeriodType: mockCollection[1],
        }
        expect(reducer(stateWithPeriodTypeSelected, action)).toEqual(
            expectedState
        )
    })
    it('should handle REPORT_PERIOD_SELECTED correctly', () => {
        const mockPeriod = 'faking it'
        const action = {
            type: ACTIONS.REPORT_PERIOD_SELECTED,
            payload: mockPeriod,
        }
        const expectedState = {
            ...stateWithPeriodTypeSelected,
            selectedPeriod: mockPeriod,
        }
        expect(reducer(stateWithPeriodTypeSelected, action)).toEqual(
            expectedState
        )
    })
    it('should handle LOCATION_CHANGE correctly', () => {
        const action = { type: ACTIONS.LOCATION_CHANGE }
        const expectedState = {
            ...stateWithPeriodTypeSelected,
            selectedPeriodType: '',
            selectedPeriod: '',
        }
        expect(reducer(stateWithPeriodTypeSelected, action)).toEqual(
            expectedState
        )
    })
})
