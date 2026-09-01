/*
 * The period logic is the one part of this page that cannot be checked by
 * looking at it: a report's `relativePeriods` map mixes two different kinds of
 * answer, and the difference is invisible until you try to run the report.
 */

import {
    needsCaption,
    periodOptionsForReport,
    reportNeeds,
} from '../reportShape.js'

const htmlReport = (overrides) => ({
    id: 'a1234567890',
    displayName: 'A report',
    ...overrides,
})

describe('reportNeeds', () => {
    it('asks for nothing when the report declares nothing', () => {
        expect(reportNeeds(htmlReport())).toEqual({
            orgUnit: false,
            period: false,
        })
    })

    it('reads the 2.34+ property names', () => {
        const report = htmlReport({
            reportParams: {
                reportingPeriod: true,
                organisationUnit: false,
                parentOrganisationUnit: false,
                grandParentOrganisationUnit: false,
            },
        })

        expect(reportNeeds(report)).toEqual({ orgUnit: false, period: true })
    })

    it('reads the pre-2.34 param-prefixed names', () => {
        const report = htmlReport({
            reportParams: {
                paramReportingPeriod: false,
                paramOrganisationUnit: true,
                paramParentOrganisationUnit: false,
                paramGrandParentOrganisationUnit: false,
            },
        })

        expect(reportNeeds(report)).toEqual({ orgUnit: true, period: false })
    })

    it('treats any of the three org unit flags as asking for an org unit', () => {
        const report = htmlReport({
            reportParams: { grandParentOrganisationUnit: true },
        })

        expect(reportNeeds(report).orgUnit).toBe(true)
    })
})

describe('periodOptionsForReport', () => {
    it('expands a "this period" key into the fixed period types it means', () => {
        const report = htmlReport({ relativePeriods: { thisMonth: true } })

        expect(periodOptionsForReport(report)).toEqual([
            { id: 'Monthly', displayName: 'Monthly', isRelative: false },
        ])
    })

    it('keeps a true relative period as one relative option', () => {
        const report = htmlReport({ relativePeriods: { lastMonth: true } })
        const options = periodOptionsForReport(report)

        expect(options).toHaveLength(1)
        expect(options[0]).toMatchObject({ id: 'lastMonth', isRelative: true })
    })

    it('ignores keys the report set to false', () => {
        const report = htmlReport({
            relativePeriods: { lastMonth: true, lastYear: false },
        })

        expect(periodOptionsForReport(report).map((o) => o.id)).toEqual([
            'lastMonth',
        ])
    })

    it('falls back to every fixed period type when none are declared', () => {
        const options = periodOptionsForReport(htmlReport())

        expect(options.length).toBeGreaterThan(1)
        expect(options.every((option) => !option.isRelative)).toBe(true)
        expect(options.map((option) => option.id)).toContain('Monthly')
    })

    it('drops period types the app cannot build a period list for', () => {
        // thisWeek names five weekly types; only plain Weekly has a generator.
        const report = htmlReport({ relativePeriods: { thisWeek: true } })

        expect(periodOptionsForReport(report).map((o) => o.id)).toEqual([
            'Weekly',
        ])
    })
})

describe('needsCaption', () => {
    it('says nothing for a report that asks for nothing', () => {
        expect(needsCaption(htmlReport())).toBe('')
    })

    it('names both when both are asked for', () => {
        const report = htmlReport({
            reportParams: { reportingPeriod: true, organisationUnit: true },
        })

        expect(needsCaption(report)).toMatch(/period and organisation unit/i)
    })
})
