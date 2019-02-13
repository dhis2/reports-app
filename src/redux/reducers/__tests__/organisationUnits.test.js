import reducer, { ACTIONS, initialState } from '../organisationUnits'

describe('Reducer - organisationUnits', () => {
    const mockCollection = [
        { id: '1', displayName: '1' },
        { id: '2', displayName: '2' },
        { id: '3', displayName: '3' },
    ]
    const errorStr = 'Oops'

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })

    describe('handling receiving org unigs', () => {
        it('should set the org unit options to the provided values', () => {
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

        it('should set the error message when an error has occured', () => {
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
    })

    const stateWithSelected = {
        ...initialState,
        ready: true,
        collection: mockCollection,
        selected: mockCollection[0],
    }

    describe('handling org unit selection', () => {
        it('should set the provided orgUnit as selected org Unit', () => {
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

        it('should return the current state when the action contains the currently selected OrgUnit', () => {
            const action = {
                type: ACTIONS.ORGANISATION_UNIT_SELECTED,
                payload: mockCollection[0],
            }
            expect(reducer(stateWithSelected, action)).toEqual(
                stateWithSelected
            )
        })
    })

    describe('handling org unit group sets', () => {
        const groupSets = [
            { id: 'foo', displayName: 'foo' },
            { id: 'bar', displayName: 'bar' },
            { id: 'baz', displayName: 'baz' },
        ]

        it('should indicate that the group sets are being loaded', () => {
            const action = { type: ACTIONS.LOADING_GROUP_SETS_START }
            const preState = {
                ...initialState,
                loading: false,
                loadingError: 'foo',
            }
            const postState = reducer(preState, action)
            const expected = {
                ...initialState,
                loading: true,
                loadingError: '',
            }

            expect(postState).toEqual(expected)
        })

        it('should set the group sets to the provided value', () => {
            const action = {
                type: ACTIONS.LOADING_GROUP_SETS_SUCCESS,
                payload: groupSets,
            }
            const preState = { ...initialState, groupSets: [], loading: true }
            const postState = reducer(preState, action)
            const expected = {
                ...initialState,
                groupSets,
                loading: false,
            }

            expect(postState).toEqual(expected)
        })

        it('should set the error message to the provided value', () => {
            const action = {
                type: ACTIONS.LOADING_GROUP_SETS_ERROR,
                payload: 'foo',
            }
            const preState = {
                ...initialState,
                loading: true,
                loadingError: '',
            }
            const postState = reducer(preState, action)
            const expected = {
                ...initialState,
                loading: false,
                loadingError: 'foo',
            }

            expect(postState).toEqual(expected)
        })

        it('should set the provided groupSet as selected', () => {
            const groupSetId = 'bar'
            const action = { type: ACTIONS.SET_GROUP_SET, payload: groupSetId }
            const preState = { ...initialState, selectedGroupSet: '' }
            const postState = reducer(preState, action)
            const expected = {
                ...initialState,
                selectedGroupSet: groupSetId,
            }

            expect(postState).toEqual(expected)
        })
    })

    describe('Resetting on location change', () => {
        it('should reset the selected org unit on location change', () => {
            const action = { type: ACTIONS.LOCATION_CHANGE }
            const expectedState = {
                ...stateWithSelected,
                selected: null,
            }
            expect(reducer(stateWithSelected, action)).toEqual(expectedState)
        })
    })
})
