import reducer, { defaultState } from '../feedback'
import { actionTypes as ACTIONS } from '../../actions/feedback'
import * as FEEDBACK_TYPES from '../../../utils/feedbackTypes'

describe('Reducer - feedback', () => {
    const message = 'Hello world'

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState)
    })
    it('should handle FEEDBACK_CLEAR correctly', () => {
        const action = {
            type: ACTIONS.FEEDBACK_CLEAR,
        }
        expect(reducer(undefined, action)).toEqual(defaultState)
    })
    it('should handle FEEDBACK_SHOW_LOADER correctly', () => {
        const action = {
            type: ACTIONS.FEEDBACK_SHOW_LOADER,
        }
        const expectedState = {
            ...defaultState,
            showLoader: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
    it('should handle FEEDBACK_SHOW_SNACKBAR correctly', () => {
        const action = {
            type: ACTIONS.FEEDBACK_SHOW_SNACKBAR,
            payload: { message, type: FEEDBACK_TYPES.ACTION_MESSAGE },
        }
        const expectedState = {
            ...defaultState,
            message,
            type: FEEDBACK_TYPES.ACTION_MESSAGE,
            showSnackbar: true,
        }
        expect(reducer(undefined, action)).toEqual(expectedState)
    })
})
