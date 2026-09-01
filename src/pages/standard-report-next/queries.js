/*
 * Every request this page makes, in one place.
 *
 * Like the data set report prototype, everything here goes through
 * @dhis2/app-runtime — no redux, no legacy d2 instance. The endpoints are the
 * ones the current standard report page already uses.
 */

import { getPeriodStartDate } from '../../utils/periods/periodTypes.js'

/*
 * The report list.
 *
 * Only HTML reports. The Jasper types are deprecated and this page cannot run
 * them, so they are excluded at the server rather than listed and then
 * refused — a report you can see but not open is worse than one that is not
 * offered.
 *
 * That exclusion is also what keeps this query free of the 2.34 field
 * renames: `reportTable`/`visualization` and its nested `reportingParams`
 * only ever belonged to Jasper reports, which are no longer asked for. An
 * HTML report carries its own `reportParams` and `relativePeriods`.
 *
 * Fetched unpaged and searched in the browser. That keeps the rail's search
 * instant, and is the first thing to revisit if an instance turns out to hold
 * hundreds of reports.
 */
export const REPORTS_QUERY = {
    reports: {
        resource: 'reports',
        params: {
            filter: 'type:eq:HTML',
            fields: [
                'id',
                'displayName',
                'access',
                'sharing[public,users,userGroups]',
                'relativePeriods',
                'reportParams',
                /* Who wrote it and when — shown at the foot of the rail. */
                'created',
                'lastUpdated',
                'createdBy[displayName]',
                'lastUpdatedBy[displayName]',
            ].join(','),
            order: 'displayName:asc',
            paging: false,
        },
    },
}

/*
 * Two questions of the same endpoint: where this user may look, and whether
 * they are allowed to create a report. Creating is an authority rather than a
 * per-object access flag, so it cannot come from the report list.
 */
export const ME_QUERY = {
    me: {
        resource: 'me',
        params: {
            fields: [
                'organisationUnits[id]',
                'dataViewOrganisationUnits[id]',
                'authorities',
            ].join(','),
        },
    },
}

/*
 * The org unit's name for the summary line. Needed because a selection
 * restored from the URL is an id, and the tree only reports a name when the
 * user clicks something.
 */
export const ORG_UNIT_NAME_QUERY = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: { fields: 'id,displayName' },
    },
}

/** The id at the end of an org unit path, e.g. /a/b/c -> c */
export const idFromPath = (path) =>
    path ? path.split('/').filter(Boolean).pop() : ''

/**
 * The query string the report endpoint expects, built from only the
 * parameters this particular report actually declared. A report that does not
 * ask for a period must not be sent one — the same rule
 * appendOrgUnitsAndReportPeriodToQueryString follows today.
 */
export const reportQueryString = ({ ou, pe }) => {
    const params = new URLSearchParams()

    if (ou) {
        params.set('ou', ou)
    }

    if (pe) {
        params.set('pe', pe)

        /*
         * Relative periods ("lastMonth") and fixed ones ("202508") both
         * resolve to a start date here, and the server needs it to anchor a
         * relative period to a point in time.
         */
        const startDate = getPeriodStartDate(pe)
        if (startDate) {
            params.set('date', startDate)
        }
    }

    return params.toString()
}

/**
 * A standard report returns a finished HTML page, not JSON, so this cannot go
 * through the data engine — it needs Accept: text/html. Same reason the data
 * set report prototype fetches custom forms by hand.
 *
 * `signal` is required rather than optional: selecting a report with no
 * parameters generates immediately, so browsing the list fires a request per
 * click and the caller must be able to abandon the ones it no longer wants.
 */
export const fetchHtmlReport = async (baseUrl, { id, ou, pe }, signal) => {
    const query = reportQueryString({ ou, pe })
    /* Cache-buster, as the current page does — reports are regenerated on
     * demand and a 304 here would silently return last month's numbers. */
    const separator = query ? '&' : ''
    const url = `${baseUrl}/api/reports/${id}/data.html?${query}${separator}t=${Date.now()}`

    const response = await fetch(url, {
        credentials: 'include',
        headers: { Accept: 'text/html' },
        signal,
    })

    if (!response.ok) {
        throw new Error(
            `The server could not build this report (${response.status})`
        )
    }

    return response.text()
}
