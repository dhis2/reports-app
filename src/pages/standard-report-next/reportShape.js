/*
 * What a report asks for before it can be run.
 *
 * This is the non-obvious part of the screen. A standard report declares two
 * things independently:
 *
 *   1. `reportParams` — whether it wants an org unit, a period, or neither.
 *   2. `relativePeriods` — *which* periods it is willing to be run for.
 *
 * The second is not a list of periods. It is a map of relative period keys,
 * some of which ("thisMonth") are really a request for a fixed period type
 * rather than for a relative period at all. Getting this wrong means offering
 * periods the report does not support, so the logic is ported from the
 * selector the current page uses — getFilteredPeriodTypes — rather than
 * reinvented.
 */

import i18n from '@dhis2/d2-i18n'
import {
    fixedPeriodTranslations,
    relativePeriodsThatAreActuallyFixed,
} from '../../utils/periods/fixedPeriods.js'
import { flattenedRelativePeriods } from '../../utils/periods/relativePeriods.js'
import {
    generatePeriods,
    supportsPeriodType,
} from '../data-set-report-next/periods.js'

/*
 * Pre-2.34 servers prefix every property with `param`. Detected by shape
 * rather than by version: the report is in front of us, and one branch is
 * easier to trust than two agreeing version checks.
 */
const normaliseParams = (raw) => {
    if (!raw) {
        return {}
    }

    if ('paramReportingPeriod' in raw || 'paramOrganisationUnit' in raw) {
        return {
            reportingPeriod: raw.paramReportingPeriod,
            organisationUnit: raw.paramOrganisationUnit,
            parentOrganisationUnit: raw.paramParentOrganisationUnit,
            grandParentOrganisationUnit: raw.paramGrandParentOrganisationUnit,
        }
    }

    return raw
}

/**
 * What the rail has to ask for. Both flags false means the report runs on
 * selection with nothing to fill in — the common case.
 */
export const reportNeeds = (report) => {
    const params = normaliseParams(report?.reportParams)

    return {
        orgUnit: Boolean(
            params.organisationUnit ||
                params.parentOrganisationUnit ||
                params.grandParentOrganisationUnit
        ),
        period: Boolean(params.reportingPeriod),
    }
}

/**
 * What the report will ask for, phrased for the "Parameters" column of the
 * list. Short rather than sentence-shaped: it is read down a column, against
 * the value on the row above it, not on its own.
 */
export const needsSummary = (report) => {
    const needs = reportNeeds(report)

    if (needs.period && needs.orgUnit) {
        return i18n.t('Period, organisation unit')
    }
    if (needs.period) {
        return i18n.t('Period')
    }
    if (needs.orgUnit) {
        return i18n.t('Organisation unit')
    }

    return i18n.t('None')
}

/* Every fixed period type the app can actually build a period list for. */
const allFixedPeriodTypes = () =>
    Object.entries(fixedPeriodTranslations)
        .filter(([id]) => supportsPeriodType(id))
        .map(([id, displayName]) => ({ id, displayName, isRelative: false }))

/**
 * The period options for one report: a mix of true relative periods
 * ("Last month", chosen and done) and fixed period *types* ("Monthly", which
 * then needs a concrete period picking underneath).
 *
 * A report that declares none is offered every fixed type instead. That is
 * what the current app falls back to outside the parameters dialog, and a
 * report nobody can run is worse than one offered a broad choice.
 */
export const periodOptionsForReport = (report) => {
    const declared = report?.relativePeriods || {}

    const options = Object.keys(declared).reduce((acc, key) => {
        if (!declared[key]) {
            return acc
        }

        const fixedTypes = relativePeriodsThatAreActuallyFixed[key]

        if (fixedTypes) {
            fixedTypes
                .filter((periodType) => supportsPeriodType(periodType))
                .forEach((periodType) =>
                    acc.push({
                        id: periodType,
                        displayName: fixedPeriodTranslations[periodType],
                        isRelative: false,
                    })
                )
        } else if (flattenedRelativePeriods[key]) {
            acc.push({ ...flattenedRelativePeriods[key], isRelative: true })
        }

        return acc
    }, [])

    return options.length > 0 ? options : allFixedPeriodTypes()
}

/**
 * What to call the chosen period in the summary line above the report.
 *
 * The value that gets sent is a code — "202608", or "lastMonth" — and neither
 * belongs on screen. Which name it has depends on which kind of option was
 * picked, so resolving it needs the report as well as the selection.
 */
export const periodLabel = (report, { periodType, year, pe }) => {
    if (!pe) {
        return ''
    }

    const option = periodOptionsForReport(report).find(
        (candidate) => candidate.id === pe
    )

    if (option?.isRelative) {
        return option.displayName
    }

    const period = generatePeriods(periodType, year).find(
        (candidate) => candidate.id === pe
    )

    /* Falling back to the code is better than an empty summary line. */
    return period ? period.name : pe
}
