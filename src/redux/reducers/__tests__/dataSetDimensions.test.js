import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/dataSetDimensions'
import {
    dataSetDimensions,
    defaultSelected,
    defaultState,
} from '../dataSetDimensions'

describe('Reducers - dataSetDimensions', () => {
    const dimensionOptions = [
        { id: 'foo', displayName: 'foo' },
        { id: 'bar', displayName: 'bar' },
        { id: 'baz', displayName: 'baz' },
    ]

    it('should return the initial state when called with no state', () => {
        const state = dataSetDimensions()
        const expected = defaultState
        expect(state).toEqual(expected)
    })

    it('should set loading to true when loading data set dimensions', () => {
        const action = { type: actionTypes.LOADING_DIMENSIONS_START }
        const preState = {
            ...defaultState,
            loading: false,
        }
        const postState = dataSetDimensions(preState, action)
        const expected = {
            ...defaultState,
            loading: true,
        }

        expect(postState).toEqual(expected)
    })

    it('should set the options to the provided value', () => {
        const action = {
            type: actionTypes.LOADING_DIMENSIONS_SUCCESS,
            payload: dimensionOptions,
        }
        const preState = {
            ...defaultState,
            loading: true,
            options: [],
        }
        const postState = dataSetDimensions(preState, action)
        const expected = {
            ...defaultState,
            loading: false,
            options: dimensionOptions,
        }

        expect(postState).toEqual(expected)
    })

    it('should set loading to false on loadingError', () => {
        const action = {
            type: actionTypes.LOADING_DIMENSIONS_ERROR,
            payload: 'foo',
        }
        const preState = {
            ...defaultState,
            loading: true,
        }
        const postState = dataSetDimensions(preState, action)
        const expected = {
            ...defaultState,
            loading: false,
        }

        expect(postState).toEqual(expected)
    })

    it('should reset the dimension options on route change', () => {
        const action = { type: LOCATION_CHANGE }
        const preState = { ...defaultState, options: dimensionOptions }
        const postState = dataSetDimensions(preState, action)
        const expected = expect.objectContaining({
            options: [],
        })

        expect(postState).toEqual(expected)
    })

    it('should add the selected option to the selected values', () => {
        const action = {
            type: actionTypes.SELECT_DIMENSION_OPTION,
            payload: {
                dimension: dimensionOptions[0].id,
                value: dimensionOptions[0].displayName,
            },
        }
        const preSelectedDimensionOptions = {
            [dimensionOptions[1]]: dimensionOptions[1].displayName,
        }
        const preState = {
            ...defaultState,
            selected: preSelectedDimensionOptions,
        }
        const postState = dataSetDimensions(preState, action)
        const expected = {
            ...defaultState,
            selected: {
                ...preSelectedDimensionOptions,
                [dimensionOptions[0].id]: dimensionOptions[0].displayName,
            },
        }

        expect(postState).toEqual(expected)
    })

    it('should reset the selected dimension options on location change', () => {
        const action = { type: LOCATION_CHANGE }
        const preState = {
            ...defaultState,
            selected: {
                [dimensionOptions[0].id]: dimensionOptions[0].displayName,
            },
        }
        const postState = dataSetDimensions(preState, action)
        const expected = expect.objectContaining({
            selected: {},
        })

        expect(postState).toEqual(expected)
    })
})
