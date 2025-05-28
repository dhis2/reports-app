import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash.isempty'
import createDataTransformCache from '../../../utils/dataTransformCache.js'

const cache = createDataTransformCache()
const nameColumnDisplayName = i18n.t('Name')
const rowIndexesToRead = [1, 4, 5, 6, 7, 8]

export default function getTransformedTableData(state) {
    const data = state.reportData.content

    if (isEmpty(data)) {
        return data
    }

    if (cache.hasValidCacheFor(data)) {
        return cache.getCachedResult()
    }

    const tableData = {
        title: parseTitle(state),
        headers: parseHeaders(data),
        rows: parseRows(data.rows),
    }

    cache.setCachedResult(data, tableData)
    return tableData
}

export function parseTitle(state) {
    return [
        state.organisationUnits.selected.displayName,
        state.dataSet.selected.displayName,
        state.reportData.content.title,
    ].join(' - ')
}

export function parseHeaders(data) {
    const headers = [nameColumnDisplayName]

    const headerNames = data.headers
        .filter(
            ({ column, hidden }) => column !== 'organisationunitname' && !hidden
        )
        .map(({ column }) => column)

    headers.push(...headerNames)
    return headers
}

export function parseRows(rowsWithAllFields) {
    return rowsWithAllFields
        .map((row) => rowIndexesToRead.map((index) => row[index]))
        .sort(
            (a, b) => parseFloat(b[b.length - 1]) - parseFloat(a[a.length - 1])
        )
}
