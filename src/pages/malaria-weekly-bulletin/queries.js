/*
 * The roots for the rail's org unit tree — the user's own data-capture roots,
 * falling back to their view roots. Same shape the org-unit-distribution page
 * uses; the tree needs the ids to know where to start.
 */
export const ORG_UNIT_ROOTS_QUERY = {
    me: {
        resource: 'me',
        params: {
            fields: 'organisationUnits[id],dataViewOrganisationUnits[id]',
        },
    },
}

/** The id at the end of an org unit path, e.g. /a/b/c -> c. */
export const idFromPath = (path) =>
    typeof path === 'string' ? path.split('/').filter(Boolean).pop() : undefined
