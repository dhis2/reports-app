export const blockUi = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.htmlReport.loading ||
    state.standardReport.loading
