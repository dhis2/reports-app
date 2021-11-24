import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/orgUnitGroupSets.js'
import { orgUnitGroupSets, defaultState } from '../orgUnitGroupSets.js'

describe('Reducer - orgUnitGroupSets', () => {
    it('should return the default state', () => {
        expect(orgUnitGroupSets()).toEqual(defaultState)
    })

    const collection = [
        { id: 'foo', displayName: 'foo' },
        { id: 'bar', displayName: 'bar' },
        { id: 'baz', displayName: 'baz' },
    ]

    it('should indicate that the group sets are being loaded', () => {
        const action = { type: actionTypes.LOADING_GROUP_SETS_START }
        const preState = {
            ...defaultState,
            loading: false,
        }
        const postState = orgUnitGroupSets(preState, action)
        const expected = {
            ...defaultState,
            loading: true,
        }

        expect(postState).toEqual(expected)
    })

    it('should set the group sets to the provided value', () => {
        const action = {
            type: actionTypes.LOADING_GROUP_SETS_SUCCESS,
            payload: collection,
        }
        const preState = { ...defaultState, collection: [], loading: true }
        const postState = orgUnitGroupSets(preState, action)
        const expected = { ...defaultState, collection, loading: false }

        expect(postState).toEqual(expected)
    })

    it('should set the error message to the provided value', () => {
        const action = {
            type: actionTypes.LOADING_GROUP_SETS_ERROR,
            payload: 'foo',
        }
        const preState = {
            ...defaultState,
            loading: true,
        }
        const postState = orgUnitGroupSets(preState, action)
        const expected = {
            ...defaultState,
            loading: false,
        }

        expect(postState).toEqual(expected)
    })

    it('should set the provided groupSet as selected', () => {
        const groupSetId = 'bar'
        const action = { type: actionTypes.SET_GROUP_SET, payload: groupSetId }
        const preState = { ...defaultState, selected: '' }
        const postState = orgUnitGroupSets(preState, action)
        const expected = { ...defaultState, selected: groupSetId }

        expect(postState).toEqual(expected)
    })

    it('should keep the groupSet options on location change', () => {
        const action = { type: LOCATION_CHANGE }
        const preState = { ...defaultState, collection }
        const postState = orgUnitGroupSets(preState, action)
        const expected = expect.objectContaining({ collection })

        expect(postState).toEqual(expected)
    })

    it('should reset the selected group set on location change', () => {
        const action = { type: LOCATION_CHANGE }
        const preState = {
            ...defaultState,
            selected: collection[0].id,
        }
        const postState = orgUnitGroupSets(preState, action)
        const expected = expect.objectContaining({ selected: '' })

        expect(postState).toEqual(expected)
    })
})
