import reducer, { ACTIONS, initialState } from '../organisationUnits'

describe('Reducer - organisationUnits', () => {
    const mockCollection = [
        { id: '1', displayName: '1' },
        { id: '2', displayName: '2' },
        { id: '3', displayName: '3' },
    ]
    const errorStr = 'Oops'
    const stateWithSelected = {
        ...initialState,
        ready: true,
        collection: mockCollection,
        selected: mockCollection[0],
    }

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle ORGANISATION_UNITS_RECEIVED correctly', () => {
        const action = {
            type: ACTIONS.ORGANISATION_UNITS_RECEIVED,
            payload: mockCollection,
        }
        const expectedState = {
            ...initialState,
            collection: mockCollection,
            ready: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
    it('should handle ORGANISATION_UNITS_ERRORED correctly', () => {
        const action = {
            type: ACTIONS.ORGANISATION_UNITS_ERRORED,
            payload: errorStr,
        }
        const expectedState = {
            ...initialState,
            loadingError: errorStr,
            ready: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
    it('should handle ORGANISATION_UNIT_SELECTED correctly when selecting a new orgUnit', () => {
        const action = {
            type: ACTIONS.ORGANISATION_UNIT_SELECTED,
            payload: mockCollection[1],
        }
        const expectedState = {
            ...stateWithSelected,
            selected: mockCollection[1],
        }
        expect(reducer(stateWithSelected, action)).toEqual(expectedState)
    })
    it('should return the current state when ORGANISATION_UNIT_SELECTED action contains the currently selected OrgUnit', () => {
        const action = {
            type: ACTIONS.ORGANISATION_UNIT_SELECTED,
            payload: mockCollection[0],
        }
        expect(reducer(stateWithSelected, action)).toEqual(stateWithSelected)
    })
    it('should handle LOCATION_CHANGE correctly', () => {
        const action = { type: ACTIONS.LOCATION_CHANGE }
        const expectedState = {
            ...stateWithSelected,
            selected: null,
        }
        expect(reducer(stateWithSelected, action)).toEqual(expectedState)
    })
})
