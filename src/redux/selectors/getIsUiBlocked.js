import {
    sections,
    ORG_UNIT_DIST_REPORT_SECTION_KEY,
} from '../../config/sections.config.js'

export const getIsUiBlocked = (state) =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.dataSet.loading ||
    state.standardReport.loadingSendReport ||
    state.resource.addEditLoading ||
    (atOrgUnitDistReportSection(state) && state.orgUnitGroupSets.loading)

const atOrgUnitDistReportSection = ({ router }) =>
    router.location.pathname === sections[ORG_UNIT_DIST_REPORT_SECTION_KEY].path
