/*
 * Mounts the vendored data entry layout with report values in it.
 *
 * The unit tests prove the names line up. This proves the rest of the chain
 * actually runs: that the vendored components work with shim modules instead
 * of react-query, zustand, final-form and the rest of the data entry state
 * layer behind them, and that a figure from the report response comes out in
 * the cell the form puts it in.
 *
 * Fixtures are captured live responses — Child Health, January 2024, Sierra
 * Leone, including sub-units.
 */
import { mount } from 'enzyme'
import React from 'react'
import metadataFixture from '../__fixtures__/childHealthMetadata.json'
import reportFixture from '../__fixtures__/childHealthReport.json'
import { buildValueIndex } from '../buildValueIndex.js'
import { resolveValues } from '../resolveValues.js'
import { FormMetadataContext } from '../shared/FormMetadataContext.js'
import {
    ReportValueContext,
    createValueState,
} from '../shared/useValueStore.js'
import { hashArraysInObject } from '../vendor/hash-arrays.js'
import { SectionForm } from '../vendor/section-form/section-form.jsx'
import * as selectors from '../vendor/selectors.js'

const DATA_SET_ID = 'BfMAe6Itzgt'
const metadata = hashArraysInObject(metadataFixture)

const renderForm = () => {
    const nameIndex = buildValueIndex(reportFixture)
    const { values } = resolveValues({
        nameIndex,
        metadata,
        dataSetId: DATA_SET_ID,
    })
    const dataSet = selectors.getDataSetById(metadata, DATA_SET_ID)

    return mount(
        <FormMetadataContext.Provider value={{ data: metadata }}>
            <ReportValueContext.Provider value={createValueState(values)}>
                <SectionForm dataSet={dataSet} globalFilterText="" />
            </ReportValueContext.Provider>
        </FormMetadataContext.Provider>
    )
}

describe('form view rendering', () => {
    it('mounts the vendored section form without the data entry state layer', () => {
        expect(() => renderForm()).not.toThrow()
    })

    it('renders a section heading from the form structure', () => {
        expect(renderForm().text()).toContain('Immunization')
    })

    it('renders the data element rows the form defines', () => {
        expect(renderForm().text()).toContain('BCG doses given')
    })

    it('renders the category option combo columns', () => {
        expect(renderForm().text()).toContain('Fixed')
    })

    /*
     * The one that matters: a number from the report response, in the form.
     */
    it('puts a report figure into the form', () => {
        const bcgFixedUnder1 = reportFixture[0].rows[0][1]

        expect(renderForm().text()).toContain(bcgFixedUnder1)
    })

    /*
     * No value cell may be editable. The section header keeps its
     * filter-this-section box, which is what data entry shows and is already
     * marked hide-for-print upstream, so inputs are counted inside data cells
     * rather than across the whole form.
     */
    it('renders values as text, with nothing editable', () => {
        const form = renderForm()

        expect(form.find('td input')).toHaveLength(0)
        expect(form.find('td select')).toHaveLength(0)
        expect(form.find('td textarea')).toHaveLength(0)
    })

    it('fills every value cell with the read-only field', () => {
        const form = renderForm()
        const cells = form.find('DataEntryCell')

        expect(cells.length).toBeGreaterThan(0)
        expect(form.find('DataEntryField').length).toBe(cells.length)
    })

    /* A field the form greys out has to read differently from an empty one. */
    it('shows a dash where the report had no figure', () => {
        expect(renderForm().text()).toContain('–')
    })
})
