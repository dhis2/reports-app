/*
The following API changes were introduced in v2.35:

1. The `api/reportTables` endpoint was replaced by `api/visualizations`

2. The response payload from this endpoint now looks slightly different:
    
    < 2.35
    "reportParams": {
        "paramGrandParentOrganisationUnit": false,
        "paramReportingPeriod": false,
        "paramOrganisationUnit": false,
        "paramParentOrganisationUnit": false
    }

    >= 2.35
    "reportingParams": {
        "grandParentOrganisationUnit": false,
        "reportingPeriod": false,
        "organisationUnit": false,
        "parentOrganisationUnit": false
    }

The functions in this module are there to deal with these discrepancies
*/

export const getDataTablesResourceNameForSystemVersion = version =>
    version < 35 ? 'dataTables' : 'visualizations'
