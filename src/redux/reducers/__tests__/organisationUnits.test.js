import { LOCATION_CHANGE } from 'connected-react-router'
import reducer, { ACTIONS, initialState } from '../organisationUnits'

describe('Reducer - organisationUnits', () => {
    const errorStr = 'Oops'
    const mockCollection = [
        { id: '1', displayName: '1' },
        { id: '2', displayName: '2' },
        { id: '3', displayName: '3' },
    ]

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
                loading: false,
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
                loading: false,
            }
            expect(reducer(undefined, action)).toEqual(expectedState)
        })
    })

    describe('handling org unit selection', () => {
        const stateWithSelected = {
            ...initialState,
            loading: false,
            collection: mockCollection,
            selected: mockCollection[0],
        }

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

        it('should keep the org unit collection on location change', () => {
            const action = { type: ACTIONS.LOCATION_CHANGE }
            const expectedState = expect.objectContaining({
                collection: stateWithSelected.collection,
                loading: false,
            })

            expect(reducer(stateWithSelected, action)).toEqual(expectedState)
        })

        it('should reset the selected org unit on location change', () => {
            const action = { type: ACTIONS.LOCATION_CHANGE }
            const expectedState = expect.objectContaining({
                selected: null,
            })

            expect(reducer(stateWithSelected, action)).toEqual(expectedState)
        })
    })
})
