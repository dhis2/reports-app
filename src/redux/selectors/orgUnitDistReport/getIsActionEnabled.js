export const getIsActionEnabled = state =>
    !!(
        !state.orgUnitDistReport.chartImageLoading &&
        state.organisationUnits.selected &&
        state.orgUnitGroupSets.selected
    )
