import getTransformedDataTable, { cache } from '../getTransformedTableData'

describe('getTransformedTableData', () => {
    const responseData = {
        headers: [
            {
                name: 'orgunit',
                column: 'Organisation unit',
                valueType: 'TEXT',
                hidden: false,
                meta: true,
            },
            {
                name: 'Bpx0589u8y0',
                column: 'Facility Ownership',
                valueType: 'TEXT',
                hidden: false,
                meta: true,
            },
            {
                name: 'count',
                column: 'Count',
                valueType: 'INTEGER',
                hidden: false,
                meta: false,
            },
        ],
        metaData: {
            items: {
                KctpIIucige: { name: 'Selenga' },
                YmmeuGbqOwR: { name: 'Gbo' },
                daJPPxtIrQn: { name: 'Jaiama Bongor' },
                sxRd2XOzFbz: { name: 'Tikonko' },
                O6uvpzGd5pu: { name: 'Bo' },
                U6Kr7Gtpidn: { name: 'Kakua' },
                YuQRtpLP10I: { name: 'Badjia' },
                MAs88nJc9nL: { name: 'Private Clinic' },
                I4jWcnFmgEC: { name: 'Niawa Lenga' },
                zFDYIgyGmXG: { name: 'Bargbo' },
                BGGmAwx33dj: { name: 'Bumpe Ngao' },
                ARZ4y5i4reU: { name: 'Wonde' },
                JdhagCUEMbj: { name: 'Komboya' },
                PVLOW4bCshG: { name: 'NGO' },
                oRVt7g429ZO: { name: 'Public facilities' },
                dGheVylzol6: { name: 'Bargbe' },
                kU8vhUkAGaT: { name: 'Lugbu' },
                vWbkYPRmKyS: { name: 'Baoma' },
                w0gFTTmsUcF: { name: 'Mission' },
                npWGUj37qDe: { name: 'Valunia' },
            },
        },
        height: 34,
        width: 3,
        rows: [
            ['vWbkYPRmKyS', '', '2'],
            ['BGGmAwx33dj', 'oRVt7g429ZO', '9'],
            ['ARZ4y5i4reU', 'oRVt7g429ZO', '3'],
            ['BGGmAwx33dj', 'w0gFTTmsUcF', '1'],
            ['npWGUj37qDe', 'oRVt7g429ZO', '7'],
            ['sxRd2XOzFbz', 'oRVt7g429ZO', '6'],
            ['YuQRtpLP10I', '', '1'],
            ['U6Kr7Gtpidn', 'MAs88nJc9nL', '11'],
            ['dGheVylzol6', 'oRVt7g429ZO', '5'],
            ['JdhagCUEMbj', '', '2'],
            ['U6Kr7Gtpidn', 'w0gFTTmsUcF', '5'],
            ['npWGUj37qDe', '', '1'],
            ['ARZ4y5i4reU', '', '2'],
            ['U6Kr7Gtpidn', 'PVLOW4bCshG', '3'],
            ['KctpIIucige', '', '1'],
            ['YuQRtpLP10I', 'oRVt7g429ZO', '2'],
            ['dGheVylzol6', '', '1'],
            ['I4jWcnFmgEC', '', '2'],
            ['kU8vhUkAGaT', '', '1'],
            ['zFDYIgyGmXG', 'oRVt7g429ZO', '7'],
            ['KctpIIucige', 'oRVt7g429ZO', '2'],
            ['BGGmAwx33dj', '', '3'],
            ['sxRd2XOzFbz', '', '1'],
            ['U6Kr7Gtpidn', '', '3'],
            ['U6Kr7Gtpidn', 'oRVt7g429ZO', '19'],
            ['JdhagCUEMbj', 'oRVt7g429ZO', '3'],
            ['YmmeuGbqOwR', 'oRVt7g429ZO', '1'],
            ['zFDYIgyGmXG', '', '1'],
            ['daJPPxtIrQn', 'oRVt7g429ZO', '6'],
            ['daJPPxtIrQn', '', '2'],
            ['vWbkYPRmKyS', 'oRVt7g429ZO', '13'],
            ['I4jWcnFmgEC', 'oRVt7g429ZO', '3'],
            ['kU8vhUkAGaT', 'oRVt7g429ZO', '9'],
            ['YmmeuGbqOwR', '', '2'],
        ],
        orgUnitIds: [
            'O6uvpzGd5pu',
            'YmmeuGbqOwR',
            'JdhagCUEMbj',
            'ARZ4y5i4reU',
            'sxRd2XOzFbz',
            'vWbkYPRmKyS',
            'YuQRtpLP10I',
            'I4jWcnFmgEC',
            'daJPPxtIrQn',
            'npWGUj37qDe',
            'kU8vhUkAGaT',
            'BGGmAwx33dj',
            'dGheVylzol6',
            'U6Kr7Gtpidn',
            'KctpIIucige',
            'zFDYIgyGmXG',
        ],
    }
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
    const expectedResult = {
        title: 'Facility Ownership - Bo',
        headers: [
            'Organisation unit',
            'Mission',
            'NGO',
            'Private Clinic',
            'Public facilities',
            'Total',
        ],
        rows: [
            ['Badjia', '0', '0', '0', '2', '2'],
            ['Baoma', '0', '0', '0', '13', '13'],
            ['Bargbe', '0', '0', '0', '5', '5'],
            ['Bargbo', '0', '0', '0', '7', '7'],
            ['Bumpe Ngao', '1', '0', '0', '9', '10'],
            ['Gbo', '0', '0', '0', '1', '1'],
            ['Jaiama Bongor', '0', '0', '0', '6', '6'],
            ['Kakua', '5', '3', '11', '19', '38'],
            ['Komboya', '0', '0', '0', '3', '3'],
            ['Lugbu', '0', '0', '0', '9', '9'],
            ['Niawa Lenga', '0', '0', '0', '3', '3'],
            ['Selenga', '0', '0', '0', '2', '2'],
            ['Tikonko', '0', '0', '0', '6', '6'],
            ['Valunia', '0', '0', '0', '7', '7'],
            ['Wonde', '0', '0', '0', '3', '3'],
            ['Bo', '0', '0', '0', '0', '0'],
        ],
    }
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
