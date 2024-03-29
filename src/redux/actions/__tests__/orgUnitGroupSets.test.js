import { getOrgUnitGroupSets } from '../../../utils/api.js'
import * as feedbackTypes from '../../../utils/feedbackTypes.js'
import { mockStore } from '../../../utils/test-helpers/mockStore.js'
import { actionTypes as feedbackActionTypes } from '../feedback.js'
import {
    actionTypes,
    loadGroupSetOptions,
    loadingGroupSetsErrorDefaultMessage,
} from '../orgUnitGroupSets.js'

jest.mock('../../../utils/api', () => ({
    getOrgUnitGroupSets: jest.fn(),
}))

describe('Actions - organisationUnits GroupSets', () => {
    let store
    beforeEach(() => {
        store = mockStore({})
    })

    const mockShowErrorFeedback = (errorMessage) => ({
        type: feedbackActionTypes.FEEDBACK_SHOW_SNACKBAR,
        payload: { message: errorMessage, type: feedbackTypes.ERROR },
    })

    const mockLoadingGroupSetsStart = () => ({
        type: actionTypes.LOADING_GROUP_SETS_START,
    })

    const mockLoadingGroupSetsSuccess = (groupSets) => ({
        type: actionTypes.LOADING_GROUP_SETS_SUCCESS,
        payload: groupSets,
    })

    const mockLoadingGroupSetsError = (errorMessage) => ({
        type: actionTypes.LOADING_GROUP_SETS_ERROR,
        payload: errorMessage,
    })

    describe('loading success', () => {
        const mockResp = [1, 2, 3, 4, 5]

        beforeEach(() => {
            getOrgUnitGroupSets.mockImplementationOnce(() =>
                Promise.resolve({
                    toArray: () => mockResp,
                })
            )
        })

        it('should dispatch a loading start and success action', () => {
            const expectedActions = expect.arrayContaining([
                mockLoadingGroupSetsStart(),
                mockLoadingGroupSetsSuccess(mockResp),
            ])

            store
                .dispatch(loadGroupSetOptions())
                .then(() => expect(store.getActions()).toEqual(expectedActions))
        })
    })

    describe('loading failure', () => {
        beforeEach(() => {
            getOrgUnitGroupSets.mockImplementationOnce(() => Promise.reject())
        })

        it('should dispatch a loading start and error action', () => {
            const expectedActions = expect.arrayContaining([
                mockLoadingGroupSetsStart(),
                mockLoadingGroupSetsError(loadingGroupSetsErrorDefaultMessage),
            ])

            store
                .dispatch(loadGroupSetOptions())
                .then(() => expect(store.getActions()).toEqual(expectedActions))
        })

        it('should dispatch a show feedback action', () => {
            const expectedActions = expect.arrayContaining([
                mockShowErrorFeedback(loadingGroupSetsErrorDefaultMessage),
            ])

            store
                .dispatch(loadGroupSetOptions())
                .then(() => expect(store.getActions()).toEqual(expectedActions))
        })
    })
})
