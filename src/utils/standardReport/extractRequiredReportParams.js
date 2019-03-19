import omitBy from 'lodash.omitby'
import { isFalsy } from '../boolean/isFalsy'

export const extractRequiredReportParams = reportParams =>
    omitBy(
        {
            period: reportParams.paramReportingPeriod,
            organisationUnit:
                reportParams.paramOrganisationUnit ||
                reportParams.paramParentOrganisationUnit ||
                reportParams.paramGrandParentOrganisationUnit,
        },
        isFalsy
    )
