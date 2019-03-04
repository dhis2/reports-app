import { mockStore } from '../../../utils/test-helpers/mockStore'
import {
    actionTypes as TYPES,
    fallbackErrorMessage,
    loadPeriodTypes,
    selectPeriod,
    selectPeriodType,
    loadPeriodTypesSuccess,
    loadPeriodTypesError,
} from '../reportPeriod'
import { getPeriodTypes } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    getPeriodTypes: jest.fn(),
}))

describe('Actions - reportPeriod', () => {
    const store = mockStore({ reportPeriod: {} })

    afterEach(() => {
        store.clearActions()
        getPeriodTypes.mockClear()
    })

    describe('successfully loadPeriodTypes success', () => {
        const periodTypes = [1, 2, 3, 4, 5]

        beforeEach(() => {
            getPeriodTypes.mockImplementationOnce(() =>
                Promise.resolve(periodTypes)
            )
        })

        it('creates REPORT_PERIOD_TYPES_RECEIVED when it resolves', done => {
            const expectedActions = expect.arrayContaining([
                loadPeriodTypesSuccess(periodTypes),
            ])

            store.dispatch(loadPeriodTypes()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })
    })

    describe('loadPeriodTypes failure', () => {
        jest.spyOn(console, 'error').mockImplementation(() => null)

        beforeEach(() => {
            getPeriodTypes.mockImplementationOnce(() => Promise.reject())
        })

        afterEach(() => {
            console.error.mockClear()
        })

        it('creates REPORT_PERIOD_TYPES_ERRORED when it is rejected', done => {
            const expectedActions = expect.arrayContaining([
                loadPeriodTypesError(),
            ])

            store.dispatch(loadPeriodTypes()).then(() => {
                expect(store.getActions()).toEqual(expectedActions)
                done()
            })
        })

        it('prints the error on the console when rejected', done => {
            store.dispatch(loadPeriodTypes()).then(() => {
                expect(console.error).toHaveBeenCalledTimes(1)
                done()
            })
        })
    })
})
