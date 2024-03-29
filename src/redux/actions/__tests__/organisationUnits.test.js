import { getOrganisationUnits } from '../../../utils/api.js'
import { mockStore } from '../../../utils/test-helpers/mockStore.js'
import { showErrorSnackBar } from '../feedback.js'
import {
    loadOrganisationUnits,
    loadOrganisationUnitsErrorDefaultMessage,
    loadOrganisationUnitsStart,
    loadOrganisationUnitsSuccess,
    loadOrganisationUnitsError,
} from '../organisationUnits.js'

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

        it('should dispatch a loading start and success action', () => {
            const expectedActions = expect.arrayContaining([
                loadOrganisationUnitsStart(),
                loadOrganisationUnitsSuccess(mockResp),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
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

        it('should dispatch a loading start and error action', () => {
            const expectedActions = expect.arrayContaining([
                loadOrganisationUnitsStart(),
                loadOrganisationUnitsError(
                    loadOrganisationUnitsErrorDefaultMessage
                ),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('should dispatch a show feedback action', () => {
            const expectedActions = expect.arrayContaining([
                showErrorSnackBar(loadOrganisationUnitsErrorDefaultMessage),
            ])

            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('prints the error in the console when rejected', () => {
            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(console.error).toHaveBeenCalledTimes(1)
            })
        })
    })
})
