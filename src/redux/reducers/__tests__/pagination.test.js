import { actionTypes } from '../../actions/pagination.js'
import { defaultState, pagination } from '../pagination.js'

describe('Reducer - pagination', function () {
    it('should increase the current page num by 1', function () {
        const { GO_TO_NEXT_PAGE } = actionTypes
        const preState = {
            ...defaultState,
            page: 1,
        }
        const expected = {
            ...defaultState,
            page: 2,
        }

        const actual = pagination(preState, { type: GO_TO_NEXT_PAGE })
        expect(actual).toEqual(expected)
    })

    it('should decrease the current page num by 1', function () {
        const { GO_TO_PREV_PAGE } = actionTypes
        const preState = {
            ...defaultState,
            page: 2,
        }
        const expected = {
            ...defaultState,
            page: 1,
        }
        const actual = pagination(preState, { type: GO_TO_PREV_PAGE })
        expect(actual).toEqual(expected)
    })
})
