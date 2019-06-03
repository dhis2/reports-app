export const getIsActionEnabled = state =>
    !!(
        state.organisationUnits.selected &&
        state.reportPeriod.selectedPeriod &&
        state.dataSet.selected.id &&
        !state.reportData.loading
    )
