/*
 * The response reshaping is the one part of this page that cannot be checked
 * by looking at it: counts arrive as strings, absent counts arrive as empty
 * strings, and the selected unit's row is a subtree total masquerading as an
 * ordinary row. All three are invisible until the numbers are wrong.
 */

import {
    coveredUnitCount,
    isEmptyTable,
    toChart,
    toTable,
} from '../transform.js'

/*
 * Shaped like a real orgUnitAnalytics response: `ou` first, then one column
 * per group, and one row per requested org unit. Bo is the selected unit, so
 * its row counts its whole subtree.
 *
 * The `ou` header carries no `column` — see the fixture below.
 */
const response = {
    headers: [
        { name: 'ou' },
        { name: 'g1', column: 'Clinic' },
        { name: 'g2', column: 'Hospital' },
    ],
    rows: [
        ['Badjia', '4', '1'],
        ['Bo', '9', '3'],
        ['Anna Town', '5', ''],
    ],
}

/*
 * Cut down from an actual response — GET /api/orgUnitAnalytics for Bo and its
 * children, by Facility Type, on the SL demo database. Two things in here that
 * a hand-written fixture would not have thought to include:
 *
 *   - the `ou` header has no `column` key at all, only a name, so anything
 *     reading labels positionally would put `undefined` at the head of the
 *     table;
 *   - the parent's row really is the total of its children's — 110 either way
 *     on the full response — which is why it is pulled out of the rows.
 *
 * Rows arrive unsorted, with the parent first.
 */
const realResponse = {
    headers: [
        { name: 'ou', type: 'java.lang.String', hidden: false, meta: false },
        { name: 'chc', column: 'CHC', type: 'java.lang.String' },
        { name: 'hospital', column: 'Hospital', type: 'java.lang.String' },
        { name: 'clinic', column: 'Clinic', type: 'java.lang.String' },
    ],
    rows: [
        ['Bo', '5', '4', '7'],
        ['Gbo', '1', '', ''],
        ['Tikonko', '2', '', ''],
        ['Badjia', '2', '4', '7'],
    ],
}

describe('a real response', () => {
    const table = toTable(realResponse, { orgUnitName: 'Bo' })

    it('labels the group columns and drops the unlabelled org unit one', () => {
        expect(table.columns).toEqual([
            { id: 'chc', label: 'CHC' },
            { id: 'hospital', label: 'Hospital' },
            { id: 'clinic', label: 'Clinic' },
        ])
    })

    it('sorts the children and keeps the parent as the total', () => {
        expect(table.rows.map((row) => row.name)).toEqual([
            'Badjia',
            'Gbo',
            'Tikonko',
        ])
        expect(table.totalRow.total).toBe(16)
    })

    it('reads the total as the number of units covered', () => {
        expect(coveredUnitCount(table)).toBe(16)
    })
})

describe('toTable', () => {
    it('names the columns from the headers, less the org unit column', () => {
        expect(toTable(response, { orgUnitName: 'Bo' }).columns).toEqual([
            { id: 'g1', label: 'Clinic' },
            { id: 'g2', label: 'Hospital' },
        ])
    })

    it('reads counts as numbers and empty cells as zero', () => {
        const { rows } = toTable(response, { orgUnitName: 'Bo' })

        expect(rows.find((row) => row.name === 'Anna Town').counts).toEqual([
            5, 0,
        ])
    })

    it('totals each row', () => {
        const { rows } = toTable(response, { orgUnitName: 'Bo' })

        expect(rows.map((row) => [row.name, row.total])).toEqual([
            ['Anna Town', 5],
            ['Badjia', 5],
        ])
    })

    it('takes the selected unit out of the rows and keeps it as the total', () => {
        const { rows, totalRow } = toTable(response, { orgUnitName: 'Bo' })

        expect(rows.map((row) => row.name)).not.toContain('Bo')
        expect(totalRow).toEqual({ name: 'Bo', counts: [9, 3], total: 12 })
    })

    it('matches the selected unit regardless of case', () => {
        expect(toTable(response, { orgUnitName: 'bo' }).totalRow.name).toBe(
            'Bo'
        )
    })

    it('sorts the remaining rows by name', () => {
        expect(
            toTable(response, { orgUnitName: 'Bo' }).rows.map((row) => row.name)
        ).toEqual(['Anna Town', 'Badjia'])
    })

    it('has no total row when the selected unit is not among the rows', () => {
        expect(toTable(response, { orgUnitName: 'Kono' }).totalRow).toBeNull()
        expect(toTable(response).totalRow).toBeNull()
    })

    it('finds the org unit column by name rather than by position', () => {
        const reordered = {
            headers: [
                { name: 'g1', column: 'Clinic' },
                { name: 'ou', column: 'Organisation unit' },
            ],
            rows: [['7', 'Badjia']],
        }

        const table = toTable(reordered, { orgUnitName: 'Bo' })

        expect(table.columns).toEqual([{ id: 'g1', label: 'Clinic' }])
        expect(table.rows).toEqual([{ name: 'Badjia', counts: [7], total: 7 }])
    })

    it('survives an empty response', () => {
        expect(toTable({})).toEqual({ columns: [], rows: [], totalRow: null })
        expect(toTable(undefined)).toEqual({
            columns: [],
            rows: [],
            totalRow: null,
        })
    })
})

describe('isEmptyTable', () => {
    it('is empty with no columns', () => {
        expect(isEmptyTable(toTable({}))).toBe(true)
    })

    it('is empty when every count is zero', () => {
        const allZero = {
            headers: response.headers,
            rows: [
                ['Badjia', '', ''],
                ['Bo', '0', ''],
            ],
        }

        expect(isEmptyTable(toTable(allZero, { orgUnitName: 'Bo' }))).toBe(true)
    })

    it('is not empty when anything was counted', () => {
        expect(isEmptyTable(toTable(response, { orgUnitName: 'Bo' }))).toBe(
            false
        )
    })

    it('is not empty when only the total row has counts', () => {
        const leafOnly = {
            headers: response.headers,
            rows: [['Bo', '9', '3']],
        }

        expect(isEmptyTable(toTable(leafOnly, { orgUnitName: 'Bo' }))).toBe(
            false
        )
    })
})

describe('coveredUnitCount', () => {
    it('uses the subtree total when there is one', () => {
        expect(coveredUnitCount(toTable(response, { orgUnitName: 'Bo' }))).toBe(
            12
        )
    })

    it('adds the rows up when there is no total row', () => {
        expect(coveredUnitCount(toTable(response))).toBe(22)
    })
})

describe('toChart', () => {
    it('draws one stacked series per group, over the rows', () => {
        const chart = toChart(toTable(response, { orgUnitName: 'Bo' }), {
            title: 'Facility type',
        })

        expect(chart.data.labels).toEqual(['Anna Town', 'Badjia'])
        expect(chart.data.datasets.map((set) => set.label)).toEqual([
            'Clinic',
            'Hospital',
        ])
        expect(chart.data.datasets.map((set) => set.data)).toEqual([
            [5, 4],
            [0, 1],
        ])
        expect(chart.options.scales.xAxes[0].stacked).toBe(true)
        expect(chart.options.scales.yAxes[0].stacked).toBe(true)
        expect(chart.options.title.text).toBe('Facility type')
    })

    it('leaves the subtree total out of the stack, so nothing is counted twice', () => {
        const chart = toChart(toTable(response, { orgUnitName: 'Bo' }))

        expect(chart.data.labels).not.toContain('Bo')
    })

    it('falls back to a bar per group for a unit with nothing under it', () => {
        const leafOnly = {
            headers: response.headers,
            rows: [['Bo', '9', '3']],
        }

        const chart = toChart(toTable(leafOnly, { orgUnitName: 'Bo' }))

        expect(chart.data.labels).toEqual(['Clinic', 'Hospital'])
        expect(chart.data.datasets).toHaveLength(1)
        expect(chart.data.datasets[0].data).toEqual([9, 3])
        expect(chart.options.scales.xAxes).toBeUndefined()
    })

    it('gives every series its own colour', () => {
        const chart = toChart(toTable(response, { orgUnitName: 'Bo' }))
        const colours = chart.data.datasets.map((set) => set.backgroundColor)

        expect(new Set(colours).size).toBe(colours.length)
    })

    it('has nothing to draw without columns or rows', () => {
        expect(toChart(toTable({}))).toBeNull()
        expect(toChart(null)).toBeNull()
        expect(
            toChart({
                columns: [{ id: 'g1', label: 'Clinic' }],
                rows: [],
                totalRow: null,
            })
        ).toBeNull()
    })
})
