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
