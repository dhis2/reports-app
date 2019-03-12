import getTransformedDataTable, { cache } from '../getTransformedTableData'
import {
    responseData,
    transformedTableData,
} from '../../../../__fixtures__/orgUnitDistReport'

describe('getTransformedTableData', () => {
    const state = {
        reportData: {
            content: responseData,
        },
        organisationUnits: {
            selected: {
                displayName: 'Bo',
            },
        },
    }
    const expectedResult = transformedTableData

    it('transforms correctly', () => {
        expect(getTransformedDataTable(state)).toEqual(expectedResult)
    })
    it('will return the cached result if called for a second time with same input', () => {
        const getCachedResultSpy = jest.spyOn(cache, 'getCachedResult')
        getTransformedDataTable(state)
        expect(getCachedResultSpy).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
        getCachedResultSpy.mockRestore()
    })
})
