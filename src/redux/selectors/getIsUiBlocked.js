import { ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_PATH } from '../../config/sections.config'

export const getIsUiBlocked = state =>
    state.organisationUnits.loading ||
    state.reportPeriod.loading ||
    state.dataSet.loading ||
    (atOrgUnitDistReportSection(state) && state.orgUnitGroupSets.loading)

const atOrgUnitDistReportSection = ({ router }) =>
    router.location.pathname ===
    ORGANISATION_UNIT_DISTRIBUTION_REPORT_SECTION_PATH
