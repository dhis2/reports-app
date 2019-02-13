import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    ACTION_TYPES as TYPES,
    fallbackErrorMessage,
    loadOrganisationUnits,
    selectOrganisationUnit,
} from '../organisationUnits'
import { getOrganisationUnits } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    getOrganisationUnits: jest.fn(),
}))

describe('Actions - organisationUnits', () => {
    const mockStore = configureMockStore([thunk])
    const mockResp = [1, 2, 3, 4, 5]
    const state = { organisationUnits: {} }
    const mockOrgUnit = {
        id: 'myId',
        path: '/my/path',
        displayName: 'My displayName',
    }

    const MOCK_ACTIONS = {
        [TYPES.ORGANISATION_UNITS_RECEIVED]: {
            type: TYPES.ORGANISATION_UNITS_RECEIVED,
            payload: mockResp,
        },
        [TYPES.ORGANISATION_UNITS_ERRORED]: {
            type: TYPES.ORGANISATION_UNITS_ERRORED,
            payload: fallbackErrorMessage,
        },
        [TYPES.ORGANISATION_UNIT_SELECTED]: {
            type: TYPES.ORGANISATION_UNIT_SELECTED,
            payload: mockOrgUnit,
        },
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('loadOrganisationUnits successfully', () => {
        it('creates ORGANISATION_UNITS_RECEIVED when it resolves successfully', () => {
            getOrganisationUnits.mockImplementation(() =>
                Promise.resolve(mockResp)
            )
            const expectedActions = [
                MOCK_ACTIONS[TYPES.ORGANISATION_UNITS_RECEIVED],
            ]
            const store = mockStore(state)
            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })
    })
    describe('loadOrganisationUnits failure', () => {
        beforeEach(() => {
            jest.spyOn(console, 'error').mockImplementation(() => null)
        })

        afterEach(() => {
            console.error.mockClear()
        })

        it('creates ORGANISATION_UNITS_ERRORED when it is rejected', () => {
            getOrganisationUnits.mockImplementation(() => Promise.reject())
            const expectedActions = [
                MOCK_ACTIONS[TYPES.ORGANISATION_UNITS_ERRORED],
            ]
            const store = mockStore(state)
            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('prints the error in the console when rejected', () => {
            getOrganisationUnits.mockImplementation(() => Promise.reject())
            const store = mockStore(state)
            store.dispatch(loadOrganisationUnits()).then(() => {
                expect(console.error).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe('selectOrganisationUnit', () => {
        it('creates a REPORT_PERIOD_TYPE_SELECTED action', () => {
            expect(selectOrganisationUnit(undefined, mockOrgUnit)).toEqual(
                MOCK_ACTIONS[TYPES.ORGANISATION_UNIT_SELECTED]
            )
        })
    })
})
