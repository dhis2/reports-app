import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    ACTION_TYPES as TYPES,
    errorMessage,
    loadPeriodTypes,
    selectPeriod,
    selectPeriodType,
} from '../reportPeriod'
import { getPeriodTypes } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    getPeriodTypes: jest.fn(),
}))

describe('Actions - reportPeriod', () => {
    const mockStore = configureMockStore([thunk])
    const mockResp = [1, 2, 3, 4, 5]
    const state = { reportPeriod: {} }
    const mockPeriodType = 'dummy period type'
    const mockPeriod = 'dummy period'

    const MOCK_ACTIONS = {
        [TYPES.REPORT_PERIOD_TYPES_RECEIVED]: {
            type: TYPES.REPORT_PERIOD_TYPES_RECEIVED,
            payload: mockResp,
        },
        [TYPES.REPORT_PERIOD_TYPES_ERRORED]: {
            type: TYPES.REPORT_PERIOD_TYPES_ERRORED,
            payload: errorMessage,
        },
        [TYPES.REPORT_PERIOD_TYPE_SELECTED]: {
            type: TYPES.REPORT_PERIOD_TYPE_SELECTED,
            payload: mockPeriodType,
        },
        [TYPES.REPORT_PERIOD_SELECTED]: {
            type: TYPES.REPORT_PERIOD_SELECTED,
            payload: mockPeriod,
        },
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('loadPeriodTypes', () => {
        it('creates REPORT_PERIOD_TYPES_RECEIVED when it resolves successfully', () => {
            getPeriodTypes.mockImplementation(() => Promise.resolve(mockResp))
            const expectedActions = [
                MOCK_ACTIONS[TYPES.REPORT_PERIOD_TYPES_RECEIVED],
            ]
            const store = mockStore(state)
            store.dispatch(loadPeriodTypes()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })

        it('creates REPORT_PERIOD_TYPES_ERRORED when it is rejected', () => {
            getPeriodTypes.mockImplementation(() => Promise.reject())
            const expectedActions = [
                MOCK_ACTIONS[TYPES.REPORT_PERIOD_TYPES_ERRORED],
            ]
            const store = mockStore(state)
            store.dispatch(loadPeriodTypes()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
        })
    })

    describe('selectPeriodType', () => {
        it('creates a REPORT_PERIOD_TYPE_SELECTED action', () => {
            const mockEvent = { target: { value: mockPeriodType } }
            expect(selectPeriodType(mockEvent)).toEqual(
                MOCK_ACTIONS[TYPES.REPORT_PERIOD_TYPE_SELECTED]
            )
        })
    })

    describe('selectPeriod', () => {
        it('creates a REPORT_PERIOD_SELECTED action', () => {
            expect(selectPeriod(mockPeriod)).toEqual(
                MOCK_ACTIONS[TYPES.REPORT_PERIOD_SELECTED]
            )
        })
    })
})
