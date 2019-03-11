import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash.isempty'
import createDataTransformCache from '../../../utils/dataTransformCache'

const cache = createDataTransformCache()
const nameColumnDisplayName = i18n.t('Name')
const rowIndexesToRead = [
    1, // Org unit name
    4, // column values
    5,
    6,
    7,
    8,
]

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
    return data.metaData.dimensions.dx.reduce(
        (acc, dimensionCode) => {
            acc.push(data.metaData.items[dimensionCode].name)
            return acc
        },
        [nameColumnDisplayName]
    )
}

export function parseRows(rowsWithAllFields) {
    return rowsWithAllFields
        .map(row =>
            rowIndexesToRead.reduce((acc, rowIndex) => {
                acc.push(row[rowIndex])
                return acc
            }, [])
        )
        .sort(
            (a, b) => parseFloat(b[b.length - 1]) - parseFloat(a[a.length - 1])
        )
}
