/*
 * These run against captured live responses rather than hand-written objects.
 *
 * The whole design rests on one empirical claim — that the names in
 * `GET /api/dataSetReport` are the same names in `GET /api/dataEntry/metadata`.
 * A fixture someone wrote by hand would agree with itself by construction and
 * prove nothing. Both files here came off a real server (Child Health,
 * January 2024, Sierra Leone, including sub-units).
 */
import metadataFixture from '../__fixtures__/childHealthMetadata.json'
import reportFixture from '../__fixtures__/childHealthReport.json'
import { buildValueIndex, lookupValue } from '../buildValueIndex.js'
import { resolveValues } from '../resolveValues.js'
import { hashArraysInObject } from '../vendor/hash-arrays.js'
import * as selectors from '../vendor/selectors.js'

const DATA_SET_ID = 'BfMAe6Itzgt'
const metadata = hashArraysInObject(metadataFixture)

describe('buildValueIndex', () => {
    it('indexes every data element row in the report', () => {
        const index = buildValueIndex(reportFixture)
        const rowCount = reportFixture.reduce(
            (total, grid) => total + grid.rows.length,
            0
        )

        expect(Object.keys(index)).toHaveLength(rowCount)
    })

    it('reads a known figure back by name', () => {
        const index = buildValueIndex(reportFixture)

        /* Row 0 of grid 0: BCG doses given, column "Fixed, <1y". */
        expect(index['BCG doses given']['Fixed, <1y']).toBe(
            reportFixture[0].rows[0][1]
        )
    })

    it('skips the label column', () => {
        const index = buildValueIndex(reportFixture)

        expect(index['BCG doses given']['Data element']).toBeUndefined()
    })

    it('skips the grand total column so it cannot be read as a value', () => {
        const index = buildValueIndex(reportFixture)

        expect(index['BCG doses given']['Total']).toBeUndefined()
    })

    it('omits empty cells rather than storing blanks', () => {
        const index = buildValueIndex([
            {
                headers: [
                    { name: 'Data element', meta: true },
                    { name: 'Fixed' },
                    { name: 'Outreach' },
                ],
                rows: [['Some element', '12', null]],
            },
        ])

        expect(index['Some element']).toEqual({ Fixed: '12' })
    })

    it('survives an empty report', () => {
        expect(buildValueIndex([])).toEqual({})
        expect(buildValueIndex(undefined)).toEqual({})
    })
})

describe('lookupValue', () => {
    const index = buildValueIndex(reportFixture)

    it('maps the default combo to the server’s "Value" header', () => {
        const defaultIndex = { 'Some element': { Value: '7' } }

        expect(
            lookupValue(
                defaultIndex,
                { displayFormName: 'Some element' },
                { displayName: 'default', isDefault: true }
            )
        ).toBe('7')
    })

    it('returns undefined for a name the report does not carry', () => {
        expect(
            lookupValue(
                index,
                { displayFormName: 'Not in this report' },
                { displayName: 'Fixed, <1y' }
            )
        ).toBeUndefined()
    })
})

describe('resolveValues', () => {
    const nameIndex = buildValueIndex(reportFixture)
    const result = resolveValues({
        nameIndex,
        metadata,
        dataSetId: DATA_SET_ID,
    })

    it('places report figures against real metadata ids', () => {
        expect(result.matched).toBeGreaterThan(0)
    })

    /*
     * The load-bearing assertion. If the report and the metadata ever stop
     * agreeing on names, this is what catches it.
     */
    it('places every figure the report returned', () => {
        expect(result.unmatched).toBe(0)
    })

    it('keys values the way the form reads them', () => {
        const dataElements = selectors.getDataElementsByDataSetId(
            metadata,
            DATA_SET_ID
        )
        const bcg = dataElements.find(
            (de) => de.displayFormName === 'BCG doses given'
        )
        const combos = selectors.getSortedCoCsByCatComboId(
            metadata,
            bcg.categoryCombo.id
        )
        const fixedUnder1 = combos.find(
            (coc) => coc.displayName === 'Fixed, <1y'
        )

        expect(result.values[bcg.id][fixedUnder1.id].value).toBe(
            reportFixture[0].rows[0][1]
        )
    })

    it('returns empty rather than throwing when metadata is missing', () => {
        expect(
            resolveValues({ nameIndex, metadata: undefined, dataSetId: 'x' })
        ).toEqual({ values: {}, matched: 0, unmatched: 0 })
    })
})
