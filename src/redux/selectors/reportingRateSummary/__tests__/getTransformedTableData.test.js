import getTransformedTableData, {
    parseTitle,
    parseHeaders,
    parseRows,
} from '../getTransformedTableData.js'

jest.mock('@dhis2/d2-i18n', () => {
    const actual = jest.requireActual('@dhis2/d2-i18n')
    return {
        ...actual,
        t: jest.fn((key) => key),
    }
})

const mockHasValidCacheFor = jest.fn()
const mockGetCachedResult = jest.fn()
const mockSetCachedResult = jest.fn()

jest.mock('../../../../utils/dataTransformCache.js', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        hasValidCacheFor: mockHasValidCacheFor,
        getCachedResult: mockGetCachedResult,
        setCachedResult: mockSetCachedResult,
    })),
}))

describe('getTransformedTableData', () => {
    let state

    beforeEach(() => {
        jest.clearAllMocks()

        state = {
            organisationUnits: { selected: { displayName: 'OrgUnit 1' } },
            dataSet: { selected: { displayName: 'DataSet A' } },
            reportData: {
                content: {
                    title: 'Report Title',
                    headers: [
                        { column: 'data1', hidden: false },
                        { column: 'data2', hidden: false },
                        { column: 'organisationunitname', hidden: false },
                    ],
                    rows: [
                        [0, 'Org B', 0, 0, 15, 25, 35, 45, 150],
                        [0, 'Org A', 0, 0, 10, 20, 30, 40, 100],
                    ],
                },
            },
        }
    })

    it('returns cached data if available', () => {
        const fakeCachedResult = {
            title: 'OrgUnit 1 - DataSet A - Report Title',
            headers: ['Name', 'data1', 'data2'],
            rows: [
                ['Org B', 15, 25, 35, 45, 150],
                ['Org A', 10, 20, 30, 40, 100],
            ],
        }

        mockHasValidCacheFor.mockReturnValue(true)
        mockGetCachedResult.mockReturnValue(fakeCachedResult)

        const result = getTransformedTableData(state)

        expect(result).toEqual(fakeCachedResult)
        expect(mockHasValidCacheFor).toHaveBeenCalledWith(
            state.reportData.content
        )
        expect(mockGetCachedResult).toHaveBeenCalledWith(
            state.reportData.content
        )
    })

    it('transforms and caches data when no valid cache exists', () => {
        mockHasValidCacheFor.mockReturnValue(false)

        const result = getTransformedTableData(state)

        expect(result.title).toBe('OrgUnit 1 - DataSet A - Report Title')
        expect(result.headers).toEqual(['Name', 'data1', 'data2'])
        expect(result.rows).toEqual([
            ['Org B', 15, 25, 35, 45, 150],
            ['Org A', 10, 20, 30, 40, 100],
        ])

        expect(mockSetCachedResult).toHaveBeenCalledWith(
            state.reportData.content,
            expect.objectContaining({
                title: 'OrgUnit 1 - DataSet A - Report Title',
                headers: ['Name', 'data1', 'data2'],
                rows: expect.any(Array),
            })
        )
    })
})

describe('parseTitle', () => {
    it('formats title correctly', () => {
        const state = {
            organisationUnits: { selected: { displayName: 'OrgUnit X' } },
            dataSet: { selected: { displayName: 'DataSet Y' } },
            reportData: { content: { title: 'My Report' } },
        }
        const title = parseTitle(state)
        expect(title).toBe('OrgUnit X - DataSet Y - My Report')
    })
})

describe('parseHeaders', () => {
    it('filters out hidden and organisationunitname columns', () => {
        const data = {
            headers: [
                { column: 'dataA', hidden: false },
                { column: 'dataB', hidden: false },
                { column: 'organisationunitname', hidden: false },
                { column: 'hiddenCol', hidden: true },
            ],
        }
        const headers = parseHeaders(data)
        expect(headers).toEqual(['Name', 'dataA', 'dataB'])
    })
})

describe('parseRows', () => {
    it('sorts rows by last value descending', () => {
        const rows = [
            [0, 'Org A', 0, 0, 10, 20, 30, 40, 100],
            [0, 'Org B', 0, 0, 50, 60, 70, 80, 200],
            [0, 'Org C', 0, 0, 15, 25, 35, 45, 150],
        ]

        const result = parseRows(rows)

        expect(result).toEqual([
            ['Org B', 50, 60, 70, 80, 200],
            ['Org C', 15, 25, 35, 45, 150],
            ['Org A', 10, 20, 30, 40, 100],
        ])
    })
})
