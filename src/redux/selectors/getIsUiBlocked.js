export const getIsUiBlocked = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.dataSet.loading ||
    (atOrgUnitDistReportSection(state) && state.orgUnitGroupSets.loading)

const atOrgUnitDistReportSection = ({ router }) =>
    router.location.pathname === '/organisation-unit-distribution-report'
