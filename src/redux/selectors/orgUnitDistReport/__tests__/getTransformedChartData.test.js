import getTransformedChartData, { cache } from '../getTransformedChartData'
import {
    responseData,
    transformedChartData,
} from '../../../../__fixtures__/orgUnitDistReport'

describe('getTransformedChartData', () => {
    const state = {
        reportData: {
            content: responseData,
        },
        organisationUnits: {
            selected: {
                displayName: 'Bo',
                id: 'O6uvpzGd5pu',
            },
        },
    }
    const expectedResult = transformedChartData

    it('transforms correctly', () => {
        expect(getTransformedChartData(state)).toEqual(expectedResult)
    })
    it('will return the cached result if called for a second time with same input', () => {
        const getCachedResultSpy = jest.spyOn(cache, 'getCachedResult')
        getTransformedChartData(state)
        expect(getCachedResultSpy).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
        getCachedResultSpy.mockRestore()
    })
})
