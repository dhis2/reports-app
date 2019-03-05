import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash.isempty'
import createDataTransformCache from '../../../utils/dataTransformCache'

const totalColumnDisplayName = i18n.t('Total')
export const cache = createDataTransformCache()

/**
 * @param {Object} state - App state
 * @returns {Object} - Transformed table data that can be consumed by TabularReport
 */
export default function getTransformedTableData(state) {
    console.log(state)
    const data = state.reportData.content

    if (isEmpty(data)) {
        return data
    }

    if (cache.hasValidCacheFor(data)) {
        return cache.getCachedResult()
    }

    const grid = createGrid(data)
    const tableData = {
        title: getTitle(state),
        headers: getHeaders(data.headers, grid.columns),
        rows: getRows(state, grid),
    }

    cache.setCachedResult(data, tableData)
    console.log(data, tableData)
    return tableData
}

/**
 * @param {Object} data - Response data from the server
 * @returns {Object} - Containing rows and columns array, columns sorted ASC
 */
function createGrid(data) {
    // As new Set for constant time look-up
    const orgUnitLookup = new Set(data.orgUnitIds)
    const items = data.metaData.items
    const { rows, columns } = Object.keys(items).reduce(
        (acc, id) => {
            const targetArray = orgUnitLookup.has(id) ? acc.rows : acc.columns
            targetArray.push({ id: id, name: items[id].name })
            return acc
        },
        { rows: [], columns: [] }
    )
    return {
        rows,
        columns: columns.sort((a, b) =>
            // Same sorting as struts app
            a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        ),
    }
}

/**
 * @param {Object} state - app state
 * @returns {String} - table title
 */
function getTitle(state) {
    return [
        state.reportData.content.headers[1].column,
        state.organisationUnits.selected.displayName,
    ].join(' - ')
}

/**
 * @param {Array} headers - The headers object from the response data structure
 * @param {Array} columns - The grid columns
 * @returns {Array<String>} - table header names
 */
function getHeaders(headers, columns) {
    return [
        headers[0].column,
        ...columns.map(column => column.name),
        totalColumnDisplayName,
    ]
}

/**
 * @param {Object} state - app state
 * @param {Object} grid - grid object with rows and columns arrays
 * @returns {Array} - a nested array containing values for each column
 */
function getRows(state, grid) {
    const valueLookup = createValueLookup(state.reportData.content.rows)
    const selectedOrgUnitName = state.organisationUnits.selected.displayName
    return grid.rows
        .map(row => getColumns(row, grid.columns, valueLookup))
        .sort((rowA, rowB) => rowCompare(rowA, rowB, selectedOrgUnitName))
}

/**
 * @param {Array} rows - Two-dimensional array, each item contains [0]orgUnitId, [1]columnId and [2]value
 * @returns {Object} - Nested object with this shape: { OrgUnitId_1: { columnId_1: value } }
 */
function createValueLookup(rows) {
    return rows.reduce((acc, row) => {
        const [orgUnitId, columnId, value] = row
        if (!acc[orgUnitId]) {
            acc[orgUnitId] = {}
        }
        if (columnId) {
            acc[orgUnitId][columnId] = value
        }
        return acc
    }, {})
}

/**
 * @param {Object} row - grid row item containing name and ID
 * @param {Array} gridColumns - grid columns
 * @param {Object} lookup - value lookup
 * @returns {Array<String>} - all values for a row, starting with orgUnitName, ending with total
 */
function getColumns(row, gridColumns, lookup) {
    const { columns, total } = gridColumns.reduce(
        (acc, column) => {
            const value = (lookup[row.id] && lookup[row.id][column.id]) || '0'
            acc.columns.push(value)
            acc.total += parseInt(value, 10)
            return acc
        },
        { columns: [], total: 0 }
    )
    return [row.name, ...columns, total.toString()]
}

/**
 * This function is used to sort the rows, which needs to be done ASC
 * with the exception of the parent orgUnit, which should be the last item
 * @param {Array} a - current row, with org unit name at index 0
 * @param {Array} b - next row
 * @param {String} selectedOrgUnitName - name of the org unit parent
 * @returns {Number} - values 1 || -1 || 0 for sorting
 */
function rowCompare(a, b, selectedOrgUnitName) {
    const nameA = a[0].toUpperCase()
    const nameB = b[0].toUpperCase()
    const upperOrgUnitName = selectedOrgUnitName.toUpperCase()

    if (nameB === upperOrgUnitName) return -1
    if (nameA === upperOrgUnitName) return 1

    return nameA.localeCompare(nameB)
}
