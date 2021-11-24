import {
    reportResponseData,
    transformedTableData,
} from '../../../../__fixtures__/orgUnitDistReport.js'
import getTransformedTableData, { cache } from '../getTransformedTableData.js'

describe('getTransformedTableData', () => {
    const state = {
        reportData: {
            content: reportResponseData,
        },
        organisationUnits: {
            selected: {
                displayName: 'Bo',
            },
        },
    }
    const expectedResult = transformedTableData
    const getCachedResultSpy = jest.spyOn(cache, 'getCachedResult')

    it('transforms correctly', () => {
        expect(getTransformedTableData(state)).toEqual(expectedResult)
    })
    it('will return the cached result if called for a second time with same input', () => {
        getTransformedTableData(state)
        expect(getCachedResultSpy).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
        getCachedResultSpy.mockRestore()
    })
})
