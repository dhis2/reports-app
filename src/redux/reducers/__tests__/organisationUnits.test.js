import { LOCATION_CHANGE } from 'connected-react-router'
import { organisationUnits, ACTIONS, defaultState } from '../organisationUnits'

describe('Reducer - organisationUnits', () => {
    const errorStr = 'Oops'
    const mockCollection = [
        { id: 'id1', path: '/sf', displayName: 'test 1', children: [1, 2, 3] },
        { id: 'id2', path: '/sf', displayName: 'test 2', children: [1, 2, 3] },
        { id: 'id3', path: '/sf', displayName: 'test 3', children: [1, 2, 3] },
    ]

    it('should return the default state', () => {
        expect(organisationUnits(undefined, {})).toEqual(defaultState)
    })

    describe('handling receiving org unigs', () => {
        it('should set the org unit options to the provided values', () => {
            const action = {
                type: ACTIONS.ORGANISATION_UNITS_RECEIVED,
                payload: mockCollection,
            }
            const expectedState = {
                ...defaultState,
                collection: mockCollection,
                loading: false,
            }
            expect(organisationUnits(undefined, action)).toEqual(expectedState)
        })

        it('should set the error message when an error has occured', () => {
            const action = {
                type: ACTIONS.ORGANISATION_UNITS_ERRORED,
                payload: errorStr,
            }
            const expectedState = {
                ...defaultState,
                loading: false,
            }
            expect(organisationUnits(undefined, action)).toEqual(expectedState)
        })
    })

    describe('handling org unit selection', () => {
        const stateWithSelected = {
            ...defaultState,
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
            expect(organisationUnits(stateWithSelected, action)).toEqual(
                expectedState
            )
        })

        it('should return the current state when the action contains the currently selected OrgUnit', () => {
            const action = {
                type: ACTIONS.ORGANISATION_UNIT_SELECTED,
                payload: mockCollection[0],
            }
            expect(organisationUnits(stateWithSelected, action)).toEqual(
                stateWithSelected
            )
        })

        it('should keep the org unit collection on location change', () => {
            const action = { type: ACTIONS.LOCATION_CHANGE }
            const expectedState = expect.objectContaining({
                collection: stateWithSelected.collection,
                loading: false,
            })

            expect(organisationUnits(stateWithSelected, action)).toEqual(
                expectedState
            )
        })

        it('should reset the selected org unit on location change', () => {
            const action = { type: ACTIONS.LOCATION_CHANGE }
            const expectedState = expect.objectContaining({
                selected: null,
            })

            expect(organisationUnits(stateWithSelected, action)).toEqual(
                expectedState
            )
        })
    })
})
