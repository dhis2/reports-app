import { ORG_UNIT_DIST_REPORT_SECTION_PATH } from '../../config/sections.config'

export const getIsUiBlocked = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.dataSet.loading ||
    (atOrgUnitDistReportSection(state) && state.orgUnitGroupSets.loading)

const atOrgUnitDistReportSection = ({ router }) =>
    router.location.pathname === ORG_UNIT_DIST_REPORT_SECTION_PATH
