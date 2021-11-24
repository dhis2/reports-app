import * as FEEDBACK_TYPES from '../../../utils/feedbackTypes.js'
import {
    actionTypes as ACTIONS,
    clearFeedback,
    showLoader,
    showSnackbar,
    showSuccessSnackBar,
    showErrorSnackBar,
    showWarningSnackBar,
} from '../feedback.js'

describe('Actions - feedback', () => {
    const message = 'Hello world'

    it('clearFeedback creates a FEEDBACK_CLEAR action', () => {
        expect(clearFeedback()).toEqual({
            type: ACTIONS.FEEDBACK_CLEAR,
        })
    })
    it('showLoader creates a FEEDBACK_SHOW_LOADER action', () => {
        expect(showLoader()).toEqual({
            type: ACTIONS.FEEDBACK_SHOW_LOADER,
        })
    })
    it('showSnackbar creates a FEEDBACK_SHOW_SNACKBAR action', () => {
        expect(showSnackbar(message)).toEqual({
            type: ACTIONS.FEEDBACK_SHOW_SNACKBAR,
            payload: { message, type: FEEDBACK_TYPES.ACTION_MESSAGE },
        })
    })
    it('showSuccessSnackBar creates a FEEDBACK_SHOW_SNACKBAR action with feedback type SUCCESS', () => {
        expect(showSuccessSnackBar(message)).toEqual({
            type: ACTIONS.FEEDBACK_SHOW_SNACKBAR,
            payload: { message, type: FEEDBACK_TYPES.SUCCESS },
        })
    })
    it('showErrorSnackBar creates a FEEDBACK_SHOW_SNACKBAR action with feedback type ERROR', () => {
        expect(showErrorSnackBar(message)).toEqual({
            type: ACTIONS.FEEDBACK_SHOW_SNACKBAR,
            payload: { message, type: FEEDBACK_TYPES.ERROR },
        })
    })
    it('showWarningSnackBar creates a FEEDBACK_SHOW_SNACKBAR action with feedback type WARNING', () => {
        expect(showWarningSnackBar(message)).toEqual({
            type: ACTIONS.FEEDBACK_SHOW_SNACKBAR,
            payload: { message, type: FEEDBACK_TYPES.WARNING },
        })
    })
})
