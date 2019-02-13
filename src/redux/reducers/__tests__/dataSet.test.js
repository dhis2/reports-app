import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/dataSet'
import { dataSet, defaultSelected, defaultState } from '../dataSet'

describe('Reducers - dataSet', () => {
    describe('initial state', () => {
        it('should return the initial state when called with no state', () => {
            const state = dataSet()
            const expected = defaultState
            expect(state).toEqual(expected)
        })
    })

    describe('data set options', () => {
        const dataSetOptions = [
            { id: 'foo', displayName: 'foo' },
            { id: 'bar', displayName: 'bar' },
            { id: 'baz', displayName: 'baz' },
        ]

        it('should set loading to true when loading data set options', () => {
            const action = { type: actionTypes.LOADING_DATA_SET_OPTIONS_START }
            const preState = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
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
                ready: false,
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
                options: dataSetOptions,
                ready: true,
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
                loadingError: '',
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
            }

            expect(postState).toEqual(expected)
        })

        it('should reset the data set options on route change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, options: dataSetOptions }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                options: [],
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
            const expected = {
                ...defaultState,
                selected: defaultSelected,
            }

            expect(postState).toEqual(expected)
        })
    })

    describe('data set dimensions', () => {
        const dimensionOptions = [
            { id: 'foo', displayName: 'foo' },
            { id: 'bar', displayName: 'bar' },
            { id: 'baz', displayName: 'baz' },
        ]

        it('should set loading to true when loading data set dimensions', () => {
            const action = { type: actionTypes.LOADING_DIMENSIONS_START }
            const preState = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
                dimensionOptions,
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                loading: true,
                loadingError: '',
                dimensionOptions: [],
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
                dimensionOptions: [],
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
                dimensionOptions,
            }

            expect(postState).toEqual(expected)
        })

        it('should set the loadingError to the provided value', () => {
            const action = {
                type: actionTypes.LOADING_DIMENSIONS_ERROR,
                payload: 'foo',
            }
            const preState = {
                ...defaultState,
                loading: true,
                loadingError: '',
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
            }

            expect(postState).toEqual(expected)
        })

        it('should reset the dimension options on route change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, dimensionOptions }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                dimensionOptions: [],
            }

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
                selectedDimensionOptions: preSelectedDimensionOptions,
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                selectedDimensionOptions: {
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
                selectedDimensionOptions: {
                    [dimensionOptions[0].id]: dimensionOptions[0].displayName,
                },
            }
            const postState = dataSet(preState, action)
            const expected = {
                ...defaultState,
                selectedDimensionOptions: {},
            }

            expect(postState).toEqual(expected)
        })
    })
})
