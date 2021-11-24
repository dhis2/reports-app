import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash.isempty'
import createDataTransformCache from '../../../utils/dataTransformCache.js'
import { getTitle } from '../../../utils/dataTransformHelpers.js'

const orgUnitColumnDisplayName = i18n.t('Organisation Unit')
const totalColumnDisplayName = i18n.t('Total')
export const cache = createDataTransformCache()

/**
 * @param {Object} state - App state
 * @returns {Object} - Transformed table data that can be consumed by TabularReport
 */
export default function getTransformedTableData(state) {
    const data = state.reportData.content

    if (isEmpty(data)) {
        return data
    }

    if (cache.hasValidCacheFor(data)) {
        return cache.getCachedResult()
    }

    const tableData = {
        title: getTitle(state),
        headers: getHeaders(data.headers),
        rows: getRows(state),
    }

    cache.setCachedResult(data, tableData)
    return tableData
}

/**
 * @param {Array} headers - The headers array from the response data structure
 * @returns {Array<String>} - table header names
 */
function getHeaders(headers) {
    return [
        ...headers.map((header) =>
            header.name === 'ou' ? orgUnitColumnDisplayName : header.column
        ),
        totalColumnDisplayName,
    ]
}

/**
 * @param {Object} state - app state
 * @returns {Array} - a nested array containing values for each column
 */
function getRows(state) {
    const { rows } = state.reportData.content
    const selectedOrgUnitName = state.organisationUnits.selected.displayName
    return rows
        .map(toNumericWithTotal)
        .sort((rowA, rowB) =>
            ascByNameWithParentBelow(rowA, rowB, selectedOrgUnitName)
        )
}

function toNumericWithTotal(cells) {
    const cellsWithTotals = cells.reduce(
        (acc, cellStr, index) => {
            if (index === 0) {
                acc.cells.push(cellStr)
            } else {
                const cellVal = cellStr ? parseInt(cellStr, 10) : 0
                acc.cells.push(cellVal)
                acc.total += cellVal
            }
            return acc
        },
        { cells: [], total: 0 }
    )
    return [...cellsWithTotals.cells, cellsWithTotals.total]
}

/**
 * This function is used to sort the rows, which needs to be done ASC by name
 * with the exception of the parent orgUnit, which should be the last item
 * @param {Array} a - current row, with org unit name at index 0
 * @param {Array} b - next row
 * @param {String} selectedOrgUnitName - name of the org unit parent
 * @returns {Number} - values 1 || -1 || 0 for sorting
 */
function ascByNameWithParentBelow(a, b, selectedOrgUnitName) {
    const nameA = a[0].toUpperCase()
    const nameB = b[0].toUpperCase()
    const upperOrgUnitName = selectedOrgUnitName.toUpperCase()

    if (nameB === upperOrgUnitName) {
        return -1
    }
    if (nameA === upperOrgUnitName) {
        return 1
    }

    return nameA.localeCompare(nameB)
}
