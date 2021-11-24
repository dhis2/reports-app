export const getIsActionEnabled = (state) =>
    !!(
        state.organisationUnits.selected &&
        state.orgUnitGroupSets.selected &&
        !state.reportData.loading
    )
