import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    ACTION_TYPES as TYPES,
    errorMessage,
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
            payload: errorMessage,
        },
        [TYPES.ORGANISATION_UNIT_SELECTED]: {
            type: TYPES.ORGANISATION_UNIT_SELECTED,
            payload: mockOrgUnit,
        },
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('loadOrganisationUnits', () => {
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
    })

    describe('selectOrganisationUnit', () => {
        it('creates a REPORT_PERIOD_TYPE_SELECTED action', () => {
            expect(selectOrganisationUnit(undefined, mockOrgUnit)).toEqual(
                MOCK_ACTIONS[TYPES.ORGANISATION_UNIT_SELECTED]
            )
        })
    })
})
