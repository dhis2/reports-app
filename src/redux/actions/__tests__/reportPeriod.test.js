import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as api from '../../../utils/api'
import * as actions from '../reportPeriod'

describe('Actions - reportPeriod', () => {
    const TYPES = actions.ACTION_TYPES
    const mockStore = configureMockStore([thunk])
    const mockResp = [1, 2, 3, 4]
    const mockGetPeriodTypeSuccess = jest.fn(() => Promise.resolve(mockResp))
    const mockGetPeriodTypeError = jest.fn(() => Promise.reject('Oops'))
    const mockEvent = { target: { value: 'somePeriodType' } }
    const mockPeriod = 'dummy value'

    const MOCK_ACTIONS = {
        [TYPES.REPORT_PERIOD_TYPES_RECEIVED]: {
            type: TYPES.REPORT_PERIOD_TYPES_RECEIVED,
            payload: mockResp,
        },
        [TYPES.REPORT_PERIOD_TYPES_ERRORED]: {
            type: TYPES.REPORT_PERIOD_TYPES_ERRORED,
            payload: actions.loadErrorMessage,
        },
        [TYPES.REPORT_PERIOD_TYPE_SELECTED]: {
            type: TYPES.REPORT_PERIOD_TYPE_SELECTED,
            payload: mockEvent,
        },
        [TYPES.REPORT_PERIOD_SELECTED]: {
            type: TYPES.REPORT_PERIOD_SELECTED,
            payload: mockPeriod,
        },
    }

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('creates REPORT_PERIOD_TYPES_RECEIVED when loadPeriodTypes resolves successfully', () => {
        jest.mock('../../../utils/api', () => ({
            getPeriodTypes: mockGetPeriodTypeSuccess,
        }))
        const expectedActions = [
            MOCK_ACTIONS[TYPES.REPORT_PERIOD_TYPES_RECEIVED],
        ]
        const store = mockStore({ reportPeriod: {} })
        return store.dispatch(actions.loadPeriodTypes()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
})
