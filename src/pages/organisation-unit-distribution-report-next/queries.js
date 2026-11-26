/*
 * Every request this page makes, in one place.
 *
 * All of these go through @dhis2/app-runtime, so nothing here touches redux
 * or the legacy d2 instance. The endpoint and its parameters are identical to
 * the ones the current page uses — only the way the org unit list is gathered
 * differs, which is one request here rather than a d2 model round trip.
 *
 * Each prototype page keeps its own copy of the small shared queries (`me`,
 * group sets), the way standard-report-next does, so a page directory can be
 * read — and deleted — on its own.
 */

export const ORG_UNIT_ROOTS_QUERY = {
    me: {
        resource: 'me',
        params: {
            fields: 'organisationUnits[id],dataViewOrganisationUnits[id]',
        },
    },
}

/*
 * The `organisationUnitGroups:gt:0` filter is the one addition against the
 * current page. Group sets with no groups produce a report with no columns —
 * the current page offers all of them, and on a typical instance that is most
 * of them (64 group sets on the SL demo database, 4 of which have any
 * groups). There is nothing to report on, so they are not offered.
 */
export const GROUP_SETS_QUERY = {
    groupSets: {
        resource: 'organisationUnitGroupSets',
        params: {
            fields: 'id,displayName',
            filter: 'organisationUnitGroups:gt:0',
            order: 'displayName:asc',
            paging: false,
        },
    },
}

/*
 * The selected unit and the units directly under it, which together are the
 * rows of the report. Fetched in one request rather than derived, because the
 * unit's own display name is what identifies its row in the response — the
 * rows carry names, not ids.
 */
export const ORG_UNIT_WITH_CHILDREN_QUERY = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields: 'id,displayName,children[id,displayName]',
        },
    },
}

export const ANALYTICS_QUERY = {
    analytics: {
        resource: 'orgUnitAnalytics',
        params: ({ ou, ougs }) => ({ ou, ougs, columns: ougs }),
    },
}

/** The id at the end of an org unit path, e.g. /a/b/c -> c */
export const idFromPath = (path) =>
    path ? path.split('/').filter(Boolean).pop() : ''

/**
 * The `ou` parameter: the selected unit followed by the units directly under
 * it, semicolon separated. The same list the current page builds.
 */
export const orgUnitParam = (orgUnit) =>
    [orgUnit.id, ...(orgUnit.children ?? []).map((child) => child.id)].join(';')

export const buildQueryString = ({ ou, ougs }) =>
    new URLSearchParams({ ou, ougs, columns: ougs }).toString()

/**
 * Download links are plain URLs — the same ones the current page builds, so
 * the server does the work and nothing is generated in the browser.
 */
export const downloadUrls = (baseUrl, selection) => {
    const queryString = buildQueryString(selection)

    return ['xls', 'pdf'].map((extension) => ({
        extension,
        url: `${baseUrl}/api/orgUnitAnalytics.${extension}?${queryString}`,
    }))
}
