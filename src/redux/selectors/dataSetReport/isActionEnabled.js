export const isActionEnabled = state =>
    !(
        !state.organisationUnits.selected ||
        !state.dataSet.selected.id ||
        !state.reportPeriod.selectedPeriod ||
        state.dataSet.loading ||
        state.dataSetDimensions.loading ||
        state.reportData.loading
    )
