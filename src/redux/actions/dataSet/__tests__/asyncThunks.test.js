import { loadDimensions } from '../asyncThunks'
import {
    loadingDimensionsStart,
    loadingDimensionsSuccess,
    loadingDimensionsError,
} from '../../dataSet'
import { getDimensions } from '../../../../utils/api'

jest.mock('../../dataSet', () => ({
    loadingDimensionsStart: jest.fn(() => 'loadingDimensionsStart'),
    loadingDimensionsSuccess: jest.fn(() => 'loadingDimensionsSuccess'),
    loadingDimensionsError: jest.fn(() => 'loadingDimensionsError'),
}))

jest.mock('../../../../utils/api', () => ({
    getDimensions: jest.fn(() => Promise.resolve()),
}))

describe('Actions - dataSet - asyncThunks', () => {
    const dispatch = jest.fn()

    describe('loading dimensions', () => {
        const getState = jest.fn(() => ({
            dataSet: { selected: {} },
        }))

        afterEach(() => {
            loadingDimensionsStart.mockClear()
            loadingDimensionsSuccess.mockClear()
            loadingDimensionsError.mockClear()
        })

        describe('when loading dimensions', () => {
            it('should dispatch a start loading action', () => {
                loadDimensions()(dispatch, getState)
                expect(loadingDimensionsStart).toHaveBeenCalledTimes(1)
                expect(dispatch).toHaveBeenCalledWith('loadingDimensionsStart')
            })
        })

        describe('when loading dimensions successfully', () => {
            const dimensions = [1, 2, 3, 4]

            it('should dispatch a success action with the dimensions', done => {
                getDimensions.mockImplementationOnce(() =>
                    Promise.resolve({ dimensions })
                )

                loadDimensions()(dispatch, getState).then(() => {
                    expect(loadingDimensionsSuccess).toHaveBeenCalledTimes(1)
                    expect(loadingDimensionsSuccess).toHaveBeenCalledWith(
                        dimensions
                    )
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingDimensionsSuccess'
                    )
                    done()
                })
            })
        })

        describe('when loading dimensions unsuccessfully', () => {
            const error = new Error('Custom error')

            it('should dispatch an error action with the error', done => {
                getDimensions.mockImplementationOnce(() =>
                    Promise.reject(error)
                )

                loadDimensions()(dispatch, getState).then(() => {
                    expect(loadingDimensionsError).toHaveBeenCalledTimes(1)
                    expect(loadingDimensionsError).toHaveBeenCalledWith(error)
                    expect(dispatch).toHaveBeenCalledWith(
                        'loadingDimensionsError'
                    )
                    done()
                })
            })
        })
    })
})
