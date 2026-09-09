/*
 * Fetches the form structure from the same endpoint the data entry app uses.
 *
 * `GET /api/dataEntry/metadata` returns arrays; the vendored selectors expect
 * them keyed by id. hashArraysInObject is the same transform upstream applies
 * in its react-query `select` option.
 *
 * Two things worth knowing about this request:
 *   - It is instance-wide, not data-set-scoped — around 800KB against the
 *     Sierra Leone demo database. That is why it is fetched lazily, on the
 *     first switch into Form view, and then held for the rest of the session.
 *   - It is 2.39+, while this app declares minDHIS2Version 2.33. On an older
 *     server the query fails and Form view says so rather than showing an
 *     empty form.
 */
import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { hashArraysInObject } from '../vendor/hash-arrays.js'

const METADATA_QUERY = {
    metadata: {
        resource: 'dataEntry/metadata',
    },
}

export const useFormMetadataQuery = () => {
    const { called, loading, error, data, refetch } = useDataQuery(
        METADATA_QUERY,
        { lazy: true }
    )

    const metadata = useMemo(
        () => (data?.metadata ? hashArraysInObject(data.metadata) : undefined),
        [data]
    )

    return { called, loading, error, metadata, fetch: refetch }
}
