export const isActionEnabled = state =>
    !!(
        state.organisationUnits.selected &&
        state.reportPeriod.selectedPeriod &&
        !state.dataSet.loading
    )
