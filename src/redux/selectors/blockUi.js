export const blockUi = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.reportData.loading ||
    state.standardReport.loading
