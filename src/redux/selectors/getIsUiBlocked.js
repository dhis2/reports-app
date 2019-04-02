import {
    sections,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
} from '../../config/sections.config'

export const getIsUiBlocked = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.dataSet.loading ||
    (atOrgUnitDistReportSection(state) && state.orgUnitGroupSets.loading)

const atOrgUnitDistReportSection = ({ router }) =>
    router.location.pathname === sections[ORG_UNIT_DIST_REPORT_SECTION_KEY].path
