/**
 * @param {Object} state - app state
 * @returns {String} - table title
 */
export function getTitle(state) {
    return [
        state.reportData.content.headers[1].column,
        state.organisationUnits.selected.displayName,
    ].join(' - ')
}

/**
 * @param {Object} data - Response data from the server
 * @returns {Object} - Containing rows and columns array, columns sorted ASC
 */
export function createGrid(data) {
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
