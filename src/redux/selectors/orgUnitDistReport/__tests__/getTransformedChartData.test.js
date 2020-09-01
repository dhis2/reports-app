import getTransformedChartData, { cache } from '../getTransformedChartData'
import {
    chartResponseData,
    transformedChartData,
} from '../../../../__fixtures__/orgUnitDistReport'

describe('getTransformedChartData', () => {
    const state = {
        reportData: {
            content: chartResponseData,
        },
        organisationUnits: {
            selected: {
                displayName: 'Bo',
                id: 'O6uvpzGd5pu',
            },
        },
    }
    const expectedResult = transformedChartData
    const getCachedResultSpy = jest.spyOn(cache, 'getCachedResult')

    it('transforms correctly', () => {
        expect(getTransformedChartData(state)).toEqual(expectedResult)
    })
    it('will return the cached result if called for a second time with same input', () => {
        getTransformedChartData(state)
        expect(getCachedResultSpy).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
        getCachedResultSpy.mockRestore()
    })
})
