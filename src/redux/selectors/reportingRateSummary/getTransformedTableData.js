import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash.isempty'

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
    const sourceData = state.reportData.content

    if (isEmpty(sourceData)) {
        return sourceData
    }

    return {
        title: parseTitle(state),
        headers: parseHeaders(sourceData),
        rows: parseRows(sourceData.rows),
    }
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
