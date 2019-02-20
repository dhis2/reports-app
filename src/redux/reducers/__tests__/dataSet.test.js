import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/dataSet'
import { dataSet, defaultSelected, defaultState } from '../dataSet'

describe('Reducers - dataSet', () => {
    const dataSetOptions = [
        { id: 'foo', displayName: 'foo' },
        { id: 'bar', displayName: 'bar' },
        { id: 'baz', displayName: 'baz' },
    ]

    it('should return the initial state when called with no state', () => {
        const state = dataSet()
        const expected = defaultState
        expect(state).toEqual(expected)
    })

    it('should set loading to true when loading data set options', () => {
        const action = { type: actionTypes.LOADING_DATA_SET_OPTIONS_START }
        const preState = {
            ...defaultState,
            loading: false,
            options: dataSetOptions,
        }
        const postState = dataSet(preState, action)
        const expected = {
            ...defaultState,
            loading: true,
            loadingError: '',
            options: [],
        }

        expect(postState).toEqual(expected)
    })

    it('should set the options to the provided value', () => {
        const action = {
            type: actionTypes.LOADING_DATA_SET_OPTIONS_SUCCESS,
            payload: dataSetOptions,
        }
        const preState = {
            ...defaultState,
            loading: true,
            options: [],
        }
        const postState = dataSet(preState, action)
        const expected = {
            ...defaultState,
            loading: false,
            options: dataSetOptions,
        }

        expect(postState).toEqual(expected)
    })

    it('should set the loadingError to the provided value', () => {
        const action = {
            type: actionTypes.LOADING_DATA_SET_OPTIONS_ERROR,
            payload: 'foo',
        }
        const preState = {
            ...defaultState,
            loading: true,
        }
        const postState = dataSet(preState, action)
        const expected = {
            ...defaultState,
            loading: false,
        }

        expect(postState).toEqual(expected)
    })

    it('should set the selected option to the provided value', () => {
        const action = { type: actionTypes.SELECT_DATA_SET, payload: 'foo' }
        const preState = {
            ...defaultState,
            selected: defaultSelected,
            options: dataSetOptions,
        }
        const postState = dataSet(preState, action)
        const expected = {
            ...defaultState,
            selected: dataSetOptions[0],
            options: dataSetOptions,
        }

        expect(postState).toEqual(expected)
    })

    it('should reset the selected data set on location change', () => {
        const action = { type: LOCATION_CHANGE }
        const preState = { ...defaultState, selected: dataSetOptions[0] }
        const postState = dataSet(preState, action)
        const expected = expect.objectContaining({
            selected: defaultSelected,
        })

        expect(postState).toEqual(expected)
    })
})
