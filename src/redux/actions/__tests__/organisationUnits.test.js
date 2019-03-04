import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    actionTypes as TYPES,
    fallbackErrorMessage,
    loadOrganisationUnits,
    loadOrganisationUnitsErrorDefaultMessage,
    selectOrganisationUnit,
    loadOrganisationUnitsStart,
    loadOrganisationUnitsSuccess,
    loadOrganisationUnitsError,
} from '../organisationUnits'
import { showErrorSnackBar } from '../feedback'
import { getOrganisationUnits } from '../../../utils/api'
import * as feedbackTypes from '../../../utils/feedbackTypes'
import { actionTypes as feedbackActionTypes } from '../feedback'

jest.mock('../../../utils/api', () => ({
    getOrganisationUnits: jest.fn(),
}))

describe('Actions - organisationUnits', () => {
    let store
    beforeEach(() => {
        store = mockStore({})
    })

    afterEach(() => {
        getOrganisationUnits.mockClear()
    })

    describe('loadOrganisationUnits successfully', () => {
        const mockResp = [1, 2, 3, 4, 5]
        getOrganisationUnits.mockImplementationOnce(() =>
            Promise.resolve(mockResp)
        )

        it('should dispatch a loading start and success action', done => {
            const expectedActions = expect.arrayContaining([
                loadOrganisationUnitsStart(),
                loadOrganisationUnitsSuccess(mockResp),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })

    describe('loadOrganisationUnits failure', () => {
        jest.spyOn(console, 'error').mockImplementation(() => null)

        beforeEach(() => {
            getOrganisationUnits.mockImplementationOnce(() => Promise.reject())
        })

        afterEach(() => {
            console.error.mockClear()
        })

        it('should dispatch a loading start and error action', done => {
            const expectedActions = expect.arrayContaining([
                loadOrganisationUnitsStart(),
                loadOrganisationUnitsError(
                    loadOrganisationUnitsErrorDefaultMessage
                ),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('should dispatch a show feedback action', done => {
            const expectedActions = expect.arrayContaining([
                showErrorSnackBar(loadOrganisationUnitsErrorDefaultMessage),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('prints the error in the console when rejected', done => {
            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(console.error).toHaveBeenCalledTimes(1)
                done()
            })
        })
    })
})
