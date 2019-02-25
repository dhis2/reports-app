import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/reportData'
import { defaultState, reportData } from '../reportData'

describe('Reducer - reportData', () => {
    describe('Initial state', () => {
        it('should return the initial state when called with no state', () => {
            const expected = defaultState
            expect(reportData()).toBe(expected)
        })
    })

    describe('Loading the html report', () => {
        it('should unset the content when loading a new report', () => {
            const action = { type: actionTypes.LOADING_REPORT_DATA_START }
            const preState = {
                ...defaultState,
                content: 'prev content',
                loading: false,
            }
            const postState = reportData(preState, action)
            const expected = expect.objectContaining({
                content: '',
                loading: true,
            })

            expect(postState).toEqual(expected)
        })

        it('should set the content to the provided value', () => {
            const action = {
                type: actionTypes.LOADING_REPORT_DATA_SUCCESS,
                payload: 'foo',
            }
            const preState = { ...defaultState, content: '', loading: true }
            const postState = reportData(preState, action)
            const expected = { ...defaultState, content: 'foo', loading: false }

            expect(postState).toEqual(expected)
        })

        it('should set loading to false on error', () => {
            const action = {
                type: actionTypes.LOADING_REPORT_DATA_ERROR,
                payload: 'foo',
            }
            const preState = {
                ...defaultState,
                loading: true,
            }
            const postState = reportData(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
            }

            expect(postState).toEqual(expected)
        })

        it('should unset the reportData on location change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, content: 'html string' }
            const postState = reportData(preState, action)
            const expected = expect.objectContaining({
                content: '',
            })

            expect(postState).toEqual(expected)
        })
    })

    describe('Report comment', () => {
        it('should set the comment to the provided value', () => {
            const action = {
                type: actionTypes.SET_DATA_SET_REPORT_COMMENT,
                payload: 'foo',
            }
            const preState = { ...defaultState, comment: '' }
            const postState = reportData(preState, action)
            const expected = { ...defaultState, comment: 'foo' }

            expect(postState).toEqual(expected)
        })

        it('should reset the comment on location change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, comment: 'foobar' }
            const postState = reportData(preState, action)
            const expected = expect.objectContaining({
                comment: '',
            })

            expect(postState).toEqual(expected)
        })
    })
})
