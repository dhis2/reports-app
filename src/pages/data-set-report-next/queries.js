/*
 * Every request this page makes, in one place.
 *
 * All of these go through @dhis2/app-runtime, so nothing here touches redux
 * or the legacy d2 instance. Endpoints are identical to the ones the current
 * page uses — only the requested field lists differ.
 */

/*
 * `periodType` and `openFuturePeriods` are the two additions against the
 * current page, which asks for id, displayName and formType only. They are
 * what lets the form preselect a sensible period instead of guessing.
 */
export const DATA_SETS_QUERY = {
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: 'id,displayName,formType,periodType,openFuturePeriods',
            order: 'displayName:asc',
            paging: false,
        },
    },
}

export const ORG_UNIT_ROOTS_QUERY = {
    me: {
        resource: 'me',
        params: {
            fields: 'organisationUnits[id],dataViewOrganisationUnits[id]',
        },
    },
}

export const GROUP_SETS_QUERY = {
    groupSets: {
        resource: 'organisationUnitGroupSets',
        params: {
            fields: 'id,displayName,organisationUnitGroups[id,displayName]',
            order: 'displayName:asc',
            paging: false,
        },
    },
}

export const DIMENSIONS_QUERY = {
    dimensions: {
        resource: 'dimensions/dataSet',
        id: ({ dataSetId }) => dataSetId,
        params: {
            fields: 'id,displayName,items[id,displayName]',
            order: 'name:asc',
            paging: false,
        },
    },
}

export const ORG_UNIT_NAME_QUERY = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: { fields: 'id,displayName' },
    },
}

/* Default and section forms: JSON tables */
export const REPORT_QUERY = {
    report: {
        resource: 'dataSetReport',
        params: ({ ds, pe, ou, selectedUnitOnly, filter }) => ({
            ds,
            pe,
            ou,
            selectedUnitOnly,
            filter,
        }),
    },
}

/** The id at the end of an org unit path, e.g. /a/b/c -> c */
export const idFromPath = (path) =>
    path ? path.split('/').filter(Boolean).pop() : ''

/**
 * Turns the selected dimension and group set options into the repeated
 * `filter=dimensionId:optionId` parameters the endpoint expects.
 */
export const filtersToParams = (filters) =>
    Object.entries(filters)
        .filter(([, optionId]) => Boolean(optionId))
        .map(([dimensionId, optionId]) => `${dimensionId}:${optionId}`)

export const buildQueryString = ({
    ds,
    pe,
    ou,
    selectedUnitOnly,
    filters = {},
}) => {
    const params = new URLSearchParams({
        ds,
        pe,
        ou,
        selectedUnitOnly: String(Boolean(selectedUnitOnly)),
    })

    filtersToParams(filters).forEach((filter) =>
        params.append('filter', filter)
    )

    return params.toString()
}

/**
 * Download links are plain URLs — the same ones the current page builds, so
 * the server does the work and nothing is generated in the browser.
 */
export const downloadUrls = (baseUrl, selection) => {
    const queryString = buildQueryString(selection)

    return ['xls', 'pdf'].map((extension) => ({
        extension,
        url: `${baseUrl}/api/dataSetReport.${extension}?${queryString}`,
    }))
}

/**
 * Custom-form data sets return a finished HTML page rather than JSON, so this
 * one request cannot go through the data engine — it needs Accept: text/html.
 */
export const fetchCustomForm = async (baseUrl, selection) => {
    const queryString = buildQueryString(selection)
    const response = await fetch(
        `${baseUrl}/api/dataSetReport/custom?${queryString}`,
        {
            credentials: 'include',
            headers: { Accept: 'text/html' },
        }
    )

    if (!response.ok) {
        throw new Error(
            `The server could not build this report (${response.status})`
        )
    }

    return response.text()
}
