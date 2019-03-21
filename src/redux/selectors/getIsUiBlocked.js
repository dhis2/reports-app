export const getIsUiBlocked = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.standardReport.loading
