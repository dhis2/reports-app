import { LOCATION_CHANGE } from 'connected-react-router'
import { actionTypes } from '../../actions/htmlReport'
import { defaultState, htmlReport } from '../htmlReport'

describe('Reducer - htmlReport', () => {
    describe('Initial state', () => {
        it('should return the initial state when called with no state', () => {
            const expected = defaultState
            expect(htmlReport()).toBe(expected)
        })
    })

    describe('Loading the html report', () => {
        it('should set the loading state to true', () => {
            const action = { type: actionTypes.LOADING_HTML_REPORT_START }
            const preState = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
                content: '',
            }
            const postState = htmlReport(preState, action)
            const expected = {
                ...defaultState,
                loading: true,
                loadingError: '',
                content: '',
            }

            expect(postState).toEqual(expected)
        })

        it('should set the content to the provided value', () => {
            const action = {
                type: actionTypes.LOADING_HTML_REPORT_SUCCESS,
                payload: 'foo',
            }
            const preState = { ...defaultState, loading: true, content: '' }
            const postState = htmlReport(preState, action)
            const expected = { ...defaultState, loading: false, content: 'foo' }

            expect(postState).toEqual(expected)
        })

        it('should set the error message to the provided value', () => {
            const action = {
                type: actionTypes.LOADING_HTML_REPORT_ERROR,
                payload: 'foo',
            }
            const preState = {
                ...defaultState,
                loading: true,
                loadingError: '',
            }
            const postState = htmlReport(preState, action)
            const expected = {
                ...defaultState,
                loading: false,
                loadingError: 'foo',
            }

            expect(postState).toEqual(expected)
        })

        it('should unset the htmlReport on location change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, content: 'html string' }
            const postState = htmlReport(preState, action)
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
            const postState = htmlReport(preState, action)
            const expected = { ...defaultState, comment: 'foo' }

            expect(postState).toEqual(expected)
        })

        it('should reset the comment on location change', () => {
            const action = { type: LOCATION_CHANGE }
            const preState = { ...defaultState, comment: 'foobar' }
            const postState = htmlReport(preState, action)
            const expected = expect.objectContaining({
                comment: '',
            })

            expect(postState).toEqual(expected)
        })
    })
})
