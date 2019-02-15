import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    ACTION_TYPES as TYPES,
    fallbackErrorMessage,
    loadOrganisationUnits,
    loadOrganisationUnitsErrorDefaultMessage,
    loadGroupSetOptions,
    loadingGroupSetsErrorDefaultMessage,
    selectOrganisationUnit,
} from '../organisationUnits'
import { getOrganisationUnits, getOrgUnitGroupSets } from '../../../utils/api'
import * as feedbackTypes from '../../../utils/feedbackTypes'
import { ACTION_TYPES as feedbackActionTypes } from '../feedback'

jest.mock('../../../utils/api', () => ({
    getOrganisationUnits: jest.fn(),
    getOrgUnitGroupSets: jest.fn(),
}))

describe('Actions - organisationUnits', () => {
    let store
    beforeEach(() => {
        store = mockStore({})
    })

    const mockShowErrorFeedback = errorMessage => ({
        type: feedbackActionTypes.FEEDBACK_SHOW_SNACKBAR,
        payload: { message: errorMessage, type: feedbackTypes.ERROR },
    })

    describe('organisation units', () => {
        const mockLoadingOrgUnitsStart = () => ({
            type: TYPES.ORGANISATION_UNITS_LOADING_START,
        })

        const mockLoadingOrgUnitsSuccess = orgUnits => ({
            type: TYPES.ORGANISATION_UNITS_RECEIVED,
            payload: orgUnits,
        })

        const mockLoadingOrgUnitsError = errorMessage => ({
            type: TYPES.ORGANISATION_UNITS_ERRORED,
            payload: errorMessage,
        })

        describe('loadOrganisationUnits successfully', () => {
            const mockResp = [1, 2, 3, 4, 5]

            beforeEach(() => {
                getOrganisationUnits.mockImplementationOnce(() =>
                    Promise.resolve(mockResp)
                )
            })

            it('should dispatch a loading start and success action', () => {
                const expectedActions = expect.arrayContaining([
                    mockLoadingOrgUnitsStart(),
                    mockLoadingOrgUnitsSuccess(mockResp),
                ])

                store
                    .dispatch(loadOrganisationUnits())
                    .then(() =>
                        expect(store.getActions()).toEqual(expectedActions)
                    )
            })
        })

        describe('loadOrganisationUnits failure', () => {
            jest.spyOn(console, 'error').mockImplementation(() => null)

            beforeEach(() => {
                getOrganisationUnits.mockImplementationOnce(() =>
                    Promise.reject()
                )
            })

            afterEach(() => {
                console.error.mockClear()
            })

            it('should dispatch a loading start and error action', () => {
                const expectedActions = expect.arrayContaining([
                    mockLoadingOrgUnitsStart(),
                    mockLoadingOrgUnitsError(
                        loadOrganisationUnitsErrorDefaultMessage
                    ),
                ])

                store.dispatch(loadOrganisationUnits()).then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
            })

            it('should dispatch a show feedback action', () => {
                const expectedActions = expect.arrayContaining([
                    mockShowErrorFeedback(
                        loadOrganisationUnitsErrorDefaultMessage
                    ),
                ])

                store
                    .dispatch(loadOrganisationUnits())
                    .then(() =>
                        expect(store.getActions()).toEqual(expectedActions)
                    )
            })

            it('prints the error in the console when rejected', () => {
                store.dispatch(loadOrganisationUnits()).then(() => {
                    expect(console.error).toHaveBeenCalledTimes(1)
                })
            })
        })
    })

    describe('group sets', () => {
        const mockLoadingGroupSetsStart = () => ({
            type: TYPES.LOADING_GROUP_SETS_START,
        })

        const mockLoadingGroupSetsSuccess = groupSets => ({
            type: TYPES.LOADING_GROUP_SETS_SUCCESS,
            payload: groupSets,
        })

        const mockLoadingGroupSetsError = errorMessage => ({
            type: TYPES.LOADING_GROUP_SETS_ERROR,
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
                    .then(() =>
                        expect(store.getActions()).toEqual(expectedActions)
                    )
            })
        })

        describe('loading failure', () => {
            beforeEach(() => {
                getOrgUnitGroupSets.mockImplementationOnce(() =>
                    Promise.reject()
                )
            })

            it('should dispatch a loading start and error action', () => {
                const expectedActions = expect.arrayContaining([
                    mockLoadingGroupSetsStart(),
                    mockLoadingGroupSetsError(
                        loadingGroupSetsErrorDefaultMessage
                    ),
                ])

                store
                    .dispatch(loadGroupSetOptions())
                    .then(() =>
                        expect(store.getActions()).toEqual(expectedActions)
                    )
            })

            it('should dispatch a show feedback action', () => {
                const expectedActions = expect.arrayContaining([
                    mockShowErrorFeedback(loadingGroupSetsErrorDefaultMessage),
                ])

                store
                    .dispatch(loadGroupSetOptions())
                    .then(() =>
                        expect(store.getActions()).toEqual(expectedActions)
                    )
            })
        })
    })
})
